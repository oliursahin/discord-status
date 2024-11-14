/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Discord Client ID - Client ID from your Discord application */
  "clientId": string,
  /** Discord Client Secret - Client Secret from your Discord application */
  "clientSecret": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `set-discord-status` command */
  export type SetDiscordStatus = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `set-discord-status` command */
  export type SetDiscordStatus = {}
}

