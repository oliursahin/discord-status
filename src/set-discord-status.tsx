import { useState, useEffect } from "react";
import { List, Icon, showToast, Toast, Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { DEFAULT_PRESETS, COMMON_EMOJIS } from "./presets";
import { emojis, getEmojiForCode, getCodeForEmoji } from "./emojis";
import { authorize, getUser } from "./oauth";

interface StatusPreset {
  emoji: string;
  text: string;
  duration: number | null;
  expiresAt?: Date;
}

function StatusListItem({
  preset,
  onSelect,
}: {
  preset: StatusPreset;
  onSelect: (preset: StatusPreset) => Promise<void>;
}) {
  return (
    <List.Item
      icon={preset.emoji || "💻"}
      title={preset.text}
      subtitle={preset.duration ? `• ${preset.duration < 60 ? `${preset.duration}m` : `${preset.duration / 60}h`}` : undefined}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action title="Set Status" onAction={() => onSelect(preset)} />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action.Push
              title="Edit Preset"
              target={
                <CustomStatusForm
                  preset={preset}
                  onSubmit={onSelect}
                />
              }
              icon={Icon.Pencil}
              shortcut={{ modifiers: ["cmd"], key: "e" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

export default function SetDiscordStatus() {
  const [searchText, setSearchText] = useState("");
  const [currentStatus, setCurrentStatus] = useState<StatusPreset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function initializeAuth() {
      console.log("Starting initialization");
      try {
        console.log("Attempting to authorize");
        const token = await authorize();
        console.log("Authorization successful, token received");
        
        if (token) {
          console.log("Fetching user data");
          const userData = await getUser(token);
          console.log("User data received:", userData);
          setUser(userData);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to connect to Discord",
          message: String(error),
        });
      } finally {
        console.log("Setting loading state to false");
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  const handleAuth = async () => {
    console.log("Manual auth initiated");
    setIsLoading(true);
    try {
      const token = await authorize();
      console.log("Manual auth successful");
      if (token) {
        const userData = await getUser(token);
        console.log("User data fetched:", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Manual auth error:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to connect to Discord",
        message: String(error),
      });
    } finally {
      console.log("Setting loading state to false after manual auth");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <List isLoading={true} searchBarPlaceholder="Connecting to Discord..." />;
  }

  if (!user) {
    return (
      <List>
        <List.EmptyView
          icon="discord-icon.png"
          title="Connect Discord Account"
          description="Please authenticate with Discord to use this extension"
          actions={
            <ActionPanel>
              <Action 
                title="Connect Discord Account" 
                onAction={handleAuth}
                icon={Icon.Link} 
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  const setStatus = async (preset: StatusPreset) => {
    try {
      setCurrentStatus(preset);
      await showToast({
        style: Toast.Style.Success,
        title: "Status Updated",
        message: `Status set to ${preset.emoji} ${preset.text}`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Update Status",
        message: String(error),
      });
    }
  };

  return (
    <List
      searchBarPlaceholder="Select from presets or add a custom status..."
      onSearchTextChange={setSearchText}
      throttle
    >
      {!searchText && (
        <>
          <List.Section title="Current Status">
            {currentStatus ? (
              <StatusListItem
                key="current-status"
                preset={currentStatus}
                onSelect={setStatus}
              />
            ) : (
              <List.Item
                title="No status set"
                icon={Icon.Circle}
              />
            )}
          </List.Section>

          <List.Section title="Presets">
            {DEFAULT_PRESETS.map((preset) => (
              <StatusListItem
                key={`${preset.emoji}-${preset.text}`}
                preset={preset}
                onSelect={setStatus}
              />
            ))}
          </List.Section>
        </>
      )}

      {searchText && (
        <List.Item
          icon={searchText.startsWith(':') ? '😀' : ''}
          title={searchText.startsWith(':') ? 'Pick an emoji...' : searchText}
          actions={
            <ActionPanel>
              <Action.Push
                title="Add Duration"
                target={
                  <CustomStatusForm
                    preset={{
                      text: searchText.startsWith(':') ? '' : searchText,
                      emoji: searchText.startsWith(':') ? searchText.slice(1) : '',
                      duration: null,
                    }}
                    onSubmit={setStatus}
                  />
                }
                icon={Icon.Clock}
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}

function CustomStatusForm({
  preset,
  onSubmit,
}: {
  preset?: StatusPreset;
  onSubmit: (status: StatusPreset) => Promise<void>;
}) {
  const { pop } = useNavigation();
  const [text, setText] = useState(preset?.text || "");
  const [emoji, setEmoji] = useState(preset?.emoji || "💻");
  const [duration, setDuration] = useState<string>(preset?.duration?.toString() || "");

  const handleEmojiChange = (value: string) => {
    if (value.startsWith(":")) {
      setEmoji(getEmojiForCode(value));
    } else {
      setEmoji(value);
    }
  };

  const handleSubmit = async () => {
    await onSubmit({
      text,
      emoji: emoji || "💻",
      duration: duration ? parseInt(duration) : null,
    });
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm 
            title={preset ? "Save Changes" : "Set Status"} 
            onSubmit={handleSubmit} 
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        id="emoji"
        title="Emoji"
        placeholder="Select an emoji or type : for code"
        value={emoji}
        onChange={handleEmojiChange}
      >
        {emojis.map((item) => (
          <Form.Dropdown.Item
            key={item.emoji}
            value={item.emoji}
            title={`${item.emoji}  ${item.name} ${getCodeForEmoji(item.emoji)}`}
          />
        ))}
      </Form.Dropdown>
      <Form.TextField
        id="text"
        title="Status Text"
        placeholder="What's your status?"
        value={text}
        onChange={setText}
      />
      <Form.Dropdown
        id="duration"
        title="Clear After"
        placeholder="Select duration"
        value={duration}
        onChange={setDuration}
      >
        <Form.Dropdown.Item value="" title="Don't clear" />
        <Form.Dropdown.Item value="15" title="15 minutes" />
        <Form.Dropdown.Item value="30" title="30 minutes" />
        <Form.Dropdown.Item value="60" title="1 hour" />
        <Form.Dropdown.Item value="120" title="2 hours" />
        <Form.Dropdown.Item value="240" title="4 hours" />
        <Form.Dropdown.Item value="1440" title="Today" />
      </Form.Dropdown>
    </Form>
  );
} 