<p align="center">
  <img src="https://raw.githubusercontent.com/XazepysK/wbails-v2/master/Media/logo.png" alt="wbails-v2 WhatsApp Web API logo" width="300" />
</p>

<h1 align="center">wbails-v2 - WhatsApp Web API and Automation Library</h1>

<p align="center">
  A customized TypeScript WebSocket client for the WhatsApp Web protocol, WhatsApp bots, messaging automation, media, groups, communities, business catalogs, GraphQL, and interactive native-flow messages.
  <br />
  Modified and maintained by <b>ZanLugner</b> (<a href="https://github.com/xazepysk">@xazepysk</a>).
</p>

<p align="center">
  <a href="https://github.com/xazepysk"><img src="https://img.shields.io/badge/GitHub-xazepysk-181717?style=for-the-badge&logo=github" alt="GitHub Profile" /></a>
  <a href="https://t.me/ZanLugner"><img src="https://img.shields.io/badge/Telegram-@ZanLugner-229ED9?style=for-the-badge&logo=telegram" alt="Telegram Profile" /></a>
  <a href="https://github.com/XazepysK/wbails-v2"><img src="https://img.shields.io/badge/GitHub_Package-@xazepysk/wbails-2088FF?style=for-the-badge&logo=github" alt="GitHub Package" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-%3E=20.0.0-339933?style=for-the-badge&logo=node.js" alt="Node Version" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
</p>

---

## About This Fork

**wbails-v2** is a TypeScript and Node.js WhatsApp Web API library for building WhatsApp bots, customer-support tools, messaging integrations, media workflows, group automation, and business communication systems without Selenium or Chromium. It communicates directly with WhatsApp Web over WebSocket and includes typed APIs for messages, authentication, Signal sessions, groups, communities, business catalogs, privacy, GraphQL, MEX, and interactive native-flow messages.

wbails-v2 is a customized distribution of Baileys maintained by **ZanLugner**. It is built for advanced WhatsApp automation, enhanced protocol compliance, native Rust acceleration, and full WhatsApp username features.

- GitHub Profile: [https://github.com/xazepysk](https://github.com/xazepysk)
- Telegram Contact: [https://t.me/ZanLugner](https://t.me/ZanLugner)
- Source Repository: [https://github.com/XazepysK/wbails-v2](https://github.com/XazepysK/wbails-v2)

---

## Search Topics and Supported APIs

This repository covers the following developer topics and API use cases:

- WhatsApp Web API client for Node.js and TypeScript
- WhatsApp bot development and automation
- WhatsApp WebSocket protocol implementation
- QR code and pairing-code authentication
- WhatsApp text, media, document, sticker, poll, reaction, and location messages
- WhatsApp buttons, lists, native-flow, and interactive messages
- WhatsApp groups, communities, newsletters, and broadcast features
- WhatsApp business profile, product catalog, collections, and commerce tools
- WhatsApp privacy, blocklist, presence, and disappearing-message settings
- WhatsApp GraphQL, MEX GraphQL-over-WebSocket, and business APIs
- Signal Protocol sessions, multi-device authentication, LID mapping, and libsignal
- In-memory, JSON, SQLite, and multi-file authentication stores

## What is New in wbails-v2

| Feature                         | Category     | Description                                                                                                                           |
| ------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Username Protocol (MEX + USync) | Core Feature | Full support for WhatsApp username queries: availability checks, claims, PIN security, contact lookups, and username recommendations. |
| Community Management APIs       | Communities  | Manage WhatsApp Communities, subgroup hierarchies, member approval requests, participant roles, and invite links.                     |
| Discrete Message Routing        | Messaging    | Added isSecret and isProtected routing flags to MessageRelayOptions to control fan-out and protect recipient device paths.            |
| Message Simulation Engine       | Testing      | Built-in sendFakeMessage method on socket to simulate incoming/outgoing message upsert events without wire delays.                    |
| Interactive Flow Nodes          | WABinary     | Enhanced button arguments and node filters for native flows, catalog previews, location requests, and business bots.                  |
| Native Rust Cryptography        | Performance  | Accelerated MD5 and HKDF operations powered by whatsapp-rust-bridge.                                                                  |
| Custom libsignal Integration    | Security     | Backed by an updated libsignal-node fork with LID-to-PN mapping support and full ambient type declarations.                           |
| Optimized Reconnection Sync     | Resilience   | Reconnects bypass the 20-second history sync wait when prior sync state exists (accountSyncCounter > 0).                              |
| Modern ESM and Yarn Berry       | Tooling      | Packaged with Yarn 4 Berry, strict TypeScript definitions, Prettier formatting, and GitHub Packages support.                          |

---

## Installation

### Option 1: Install from GitHub Packages

Create or update your `.npmrc` file:

```ini
@xazepysk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install with your package manager:

```bash
npm install @xazepysk/wbails
```

```bash
yarn add @xazepysk/wbails
```

```bash
pnpm add @xazepysk/wbails
```

### Option 2: Install directly from GitHub

```bash
npm install github:XazepysK/wbails-v2
```

```bash
yarn add github:XazepysK/wbails-v2
```

---

## Quick Start

```typescript
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@xazepysk/wbails'
import { Boom } from '@hapi/boom'

const startSock = async () => {
	const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')

	const sock = makeWASocket({
		auth: state,
		printQRInTerminal: true
	})

	sock.ev.on('creds.update', saveCreds)

	sock.ev.on('connection.update', update => {
		const { connection, lastDisconnect } = update

		if (connection === 'close') {
			const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
			if (shouldReconnect) {
				startSock()
			}
		} else if (connection === 'open') {
			console.log('Connected to WhatsApp successfully!')
		}
	})

	sock.ev.on('messages.upsert', async ({ messages, type }) => {
		if (type === 'notify') {
			for (const msg of messages) {
				if (!msg.key.fromMe && msg.key.remoteJid) {
					console.log('Received message from:', msg.key.remoteJid)
				}
			}
		}
	})

	return sock
}

startSock()
```

---

## WhatsApp Username API

All username methods are available directly on the socket instance returned by `makeWASocket`:

| Method                       | Parameters                                                           | Return Type                       | Description                                                                          |
| ---------------------------- | -------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `checkUsername`              | `username: string, includeSuggestions?: boolean, sessionId?: string` | `Promise<UsernameCheckResult>`    | Checks whether a username is available on WhatsApp and returns suggestions if taken. |
| `setUsername`                | `username: string, options?: SetUsernameOptions`                     | `Promise<any>`                    | Claims and registers a username for the authenticated account, with optional PIN.    |
| `checkAndSetUsername`        | `username: string, includeSuggestions?: boolean`                     | `Promise<any>`                    | Validates availability first, then automatically sets the username if free.          |
| `deleteUsername`             | None                                                                 | `Promise<any>`                    | Removes the username currently associated with the authenticated account.            |
| `getMyUsername`              | None                                                                 | `Promise<string \| null>`         | Retrieves the current registered username of the connected account.                  |
| `setUsernamePin`             | `pin?: string \| null`                                               | `Promise<any>`                    | Sets or updates the security PIN for the account username.                           |
| `findUserByUsername`         | `username: string, pin?: string`                                     | `Promise<FindUserResult \| null>` | Resolves a WhatsApp user JID and contact state from their username.                  |
| `fetchContactUsernames`      | `...jids: string[]`                                                  | `Promise<any[]>`                  | Queries username records for a list of contact JIDs via USync.                       |
| `checkUsernameMulti`         | `usernames: string[]`                                                | `Promise<any>`                    | Batch checks availability across multiple usernames in a single request.             |
| `getUsernameRecommendations` | `source?: string`                                                    | `Promise<any>`                    | Requests server-recommended usernames for the current account profile.               |

### Username Example

```typescript
const result = await sock.checkUsername('mycustomname')
if (result.available) {
	await sock.setUsername('mycustomname')
	console.log('Username successfully registered!')
} else {
	console.log('Username taken. Suggestions:', result.suggestions)
}

const target = await sock.findUserByUsername('alice')
if (target) {
	await sock.sendMessage(target.jid, { text: 'Hello Alice!' })
}
```

---

## Community Management API

| Method                               | Parameters                                                           | Description                                                            |
| ------------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `communityCreate`                    | `subject: string, body?: string`                                     | Creates a new WhatsApp Community.                                      |
| `communityMetadata`                  | `jid: string`                                                        | Fetches metadata, description, and settings for a Community.           |
| `communityFetchAllParticipating`     | None                                                                 | Lists all Communities the authenticated user is currently a member of. |
| `communityFetchLinkedGroups`         | `jid: string`                                                        | Retrieves all linked announcement and sub-groups within a Community.   |
| `communityLinkGroup`                 | `communityJid: string, groupJids: string[]`                          | Links existing groups into a Community.                                |
| `communityUnlinkGroup`               | `communityJid: string, groupJid: string`                             | Unlinks a group from a Community.                                      |
| `communityRequestParticipantsList`   | `jid: string`                                                        | Retrieves pending membership requests for a Community.                 |
| `communityRequestParticipantsUpdate` | `jid: string, participants: string[], action: 'approve' \| 'reject'` | Approves or rejects membership requests.                               |
| `communityParticipantsUpdate`        | `jid: string, participants: string[], action: ParticipantAction`     | Adds, removes, promotes, or demotes Community members.                 |
| `communityUpdateDescription`         | `jid: string, description?: string`                                  | Updates the description of a Community.                                |
| `communityUpdateSubject`             | `jid: string, subject: string`                                       | Updates the title of a Community.                                      |

---

## Core Messaging Features

| Feature                 | Method                                                    | Supported Content                                |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| Text and Mentions       | `sock.sendMessage(jid, { text, mentions })`               | Extended text, URLs, contextInfo, quoted         |
| Media Messages          | `sock.sendMessage(jid, { image, caption })`               | Images, videos, audio, documents, stickers       |
| Buttons and Native Flow | `sock.sendMessage(jid, { ... })`                          | Native flows, interactive buttons, product lists |
| Disappearing Messages   | `sock.sendMessage(jid, content, { ephemeralExpiration })` | Timed messages (24 hours, 7 days, 90 days)       |
| Message Simulation      | `sock.sendFakeMessage(jid, content, opts)`                | Event pipeline testing and upsert simulation     |
| Reaction                | `sock.sendMessage(jid, { react: { text, key } })`         | Emoji reactions to existing messages             |

---

## Complete Socket API Reference

Every method below is available on the socket returned by `makeWASocket`, unless marked as a package helper. All methods return a Promise unless stated otherwise. Types are exported from the package and can be imported directly.

### Connection, Authentication, and Transport

| Methods |
| --- |
| `query`, `waitForMessage`, `waitForSocketOpen`, `sendRawMessage`, `sendNode`, `logout`, `end`, `registerSocketEndHandler`, `requestPairingCode`, `waitForConnectionUpdate` |
| `onWhatsApp`, `uploadPreKeys`, `uploadPreKeysToServerIfRequired`, `digestKeyBundle`, `rotateSignedPreKey`, `sendUnifiedSession`, `sendWAMBuffer` |
| `executeUSyncQuery`, `fetchAccountReachoutTimelock`, `fetchNewChatMessageCap`, `createCallLink`, `getBotListV2` |

Common socket properties are `ev`, `user`, `authState`, `signalRepository`, `ws`, and `serverProps`.

### Messages, Receipts, and Media

| Methods |
| --- |
| `sendMessage`, `sendFakeMessage`, `sendMessagemembers`, `sendRichMessage`, `relayMessage`, `sendReceipt`, `sendReceipts`, `readMessages`, `sendMessageAck` |
| `sendRetryRequest`, `rejectCall`, `fetchMessageHistory`, `requestPlaceholderResend`, `updateMediaMessage` |
| `sendPeerDataOperationMessage`, `updateMemberLabel`, `refreshMediaConn`, `getMediaHost`, `waUploadToServer` |
| `issuePrivacyTokens`, `assertSessions`, `createParticipantNodes`, `getUSyncDevices` |

`sendFakeMessage(jid, content, { pn, lid })` emits a realistic `messages.upsert` event with generated message ID, timestamp, participant metadata, push name, and LID addressing metadata.

Supported `sendMessage` content includes text, mentions, replies, images, videos, audio, documents, stickers, polls, reactions, locations, contacts, buttons, templates, lists, native-flow interactive buttons, carousels, Bloks widgets, sticker packs, and disappearing-message options.

### Groups

| Methods |
| --- |
| `groupMetadata`, `groupCreate`, `groupLeave`, `groupUpdateSubject`, `groupUpdateDescription`, `groupParticipantsUpdate` |
| `groupRequestParticipantsList`, `groupRequestParticipantsUpdate`, `groupInviteCode`, `groupRevokeInvite`, `groupAcceptInvite` |
| `groupRevokeInviteV4`, `groupAcceptInviteV4`, `groupGetInviteInfo`, `groupToggleEphemeral`, `groupSettingUpdate` |
| `groupMemberAddMode`, `groupJoinApprovalMode`, `groupFetchAllParticipating` |

### Communities

| Methods |
| --- |
| `communityCreate`, `communityMetadata`, `communityLeave`, `communityCreateGroup`, `communityFetchAllParticipating`, `communityFetchLinkedGroups` |
| `communityLinkGroup`, `communityUnlinkGroup`, `communityInviteCode`, `communityRevokeInvite`, `communityAcceptInvite` |
| `communityRevokeInviteV4`, `communityAcceptInviteV4`, `communityGetInviteInfo`, `communityRequestParticipantsList`, `communityRequestParticipantsUpdate` |
| `communityParticipantsUpdate`, `communityUpdateDescription`, `communityUpdateSubject`, `communityToggleEphemeral`, `communitySettingUpdate` |
| `communityMemberAddMode`, `communityJoinApprovalMode` |

### AI Groups

`aiGroupMetadata`, `aiGroupCreate`, `aiGroupAddBot`, `aiGroupLeave`, `aiGroupParticipantsUpdate`, `aiGroupUpdateSubject`, `aiGroupInviteCode`, `aiGroupRevokeInvite`, `aiGroupAcceptInvite`, `aiGroupSettingUpdate`, `aiGroupToggleEphemeral`

### Profile, Presence, Contacts, and Chats

| Methods |
| --- |
| `sendPresenceUpdate`, `presenceSubscribe`, `profilePictureUrl`, `updateProfilePicture`, `removeProfilePicture`, `updateProfileStatus`, `updateProfileName`, `getBusinessProfile` |
| `fetchStatus`, `fetchDisappearingDuration`, `fetchBlocklist`, `updateBlockStatus`, `blockContact`, `unblockContact` |
| `chatModify`, `addOrEditContact`, `removeContact`, `addLabel`, `addChatLabel`, `removeChatLabel`, `addMessageLabel`, `removeMessageLabel` |
| `star`, `addOrEditQuickReply`, `removeQuickReply`, `resyncAppState`, `cleanDirtyBits` |

### Privacy Settings

| Methods |
| --- |
| `fetchPrivacySettings`, `setPrivacySetting`, `setCallAddPrivacy`, `setLastSeenPrivacy`, `setOnlinePrivacy`, `setProfilePicturePrivacy` |
| `setStatusPrivacy`, `setReadReceiptsPrivacy`, `setGroupsAddPrivacy`, `updateDisableLinkPreviewsPrivacy`, `updateCallPrivacy`, `updateMessagesPrivacy` |
| `updateLastSeenPrivacy`, `updateOnlinePrivacy`, `updateProfilePicturePrivacy`, `updateStatusPrivacy`, `updateReadReceiptsPrivacy`, `updateGroupsAddPrivacy`, `updateDefaultDisappearingMode` |

### Newsletters

`newsletterCreate`, `newsletterUpdate`, `newsletterSubscribers`, `newsletterMetadata`, `newsletterFollow`, `newsletterUnfollow`, `newsletterMute`, `newsletterUnmute`, `newsletterUpdateName`, `newsletterUpdateDescription`, `newsletterUpdatePicture`, `newsletterRemovePicture`, `newsletterReactMessage`, `newsletterFetchMessages`, `subscribeNewsletterUpdates`, `newsletterAdminCount`, `newsletterChangeOwner`, `newsletterDemote`, `newsletterDelete`

### Business and Commerce

`getOrderDetails`, `getCatalog`, `getCollections`, `productCreate`, `productDelete`, `productUpdate`, `updateBussinesProfile`, `updateCoverPhoto`, `removeCoverPhoto`

### GraphQL and MEX

Package helpers exported from the main entry point:

- `executeWWWGraphQL`
- `executeFacebookGraphQL`
- `executeWamoGraphQL`
- `executeWMexQuery`

`executeWMexQuery` is also available as a socket method. The package additionally exports the GraphQL and MEX types and constants used by these helpers.

### Interoperability

| Methods |
| --- |
| `fetchIntegrators`, `acceptInteropTOS`, `optInIntegrators`, `optOutIntegrators`, `resolveInteropUsers`, `resolveInteropUser` |
| `getReachabilitySettings`, `setReachabilitySettings`, `blockInteropUser`, `unblockInteropUser`, `reportInteropSpam`, `trustInteropContact` |
| `initInterop`, `createInteropGroup`, `leaveInteropGroup`, `addParticipantsToInteropGroup`, `queryInteropGroupInfo` |
| `queryInteropPrivacySettings`, `updateInteropPrivacySetting`, `updateInteropPrivacySettingWithContactList`, `getInteropGroupAddPrivacy` |

The socket also exposes `INTEGRATOR_BIRDYCHAT`, `INTEGRATOR_HAIKET`, and `INTEROP_MEX_QUERY_IDS`.

### Registration, Password, Passkeys, and Account Recovery

| Methods |
| --- |
| `hasPassword`, `setPassword`, `checkPassword`, `deletePassword`, `passkeyExists`, `passkeyListExists`, `passkeyRequestChallenge`, `passkeyVerifyChallenge`, `passkeyDelete` |
| `regPasskeyStart`, `regPasskeyFinish`, `regPasskeyEnable`, `regPasskeyDisable`, `regPasskeyClear`, `regPasskeyUpdateEncryptionStatus` |
| `getRegistrationUpsells`, `getDynamicRegistrationUpsells`, `registrationUpsellShown`, `registrationDynamicUpsellShown`, `regAccountTransferVerifyToken` |
| `userCountryCodeGet`, `suggestedContactsV2`, `ageCollection`, `getAgeExperience`, `setAgeExperience`, `submitAge` |
| `getImagineMeOnboarded`, `deleteImagineMeOnboarding`, `fetchUserNoticesById`, `createEnforcementAppeal`, `getWaMeLink` |

The socket exposes the `REGISTRATION_MEX_IDS` constant.

### Managed Accounts, Payment Passkeys, UPI, and IPLS

| Methods |
| --- |
| `managedAccountQuery`, `managedAccountInitiateLinking`, `managedAccountValidateLinking`, `managedAccountAcceptLinking`, `managedAccountCompleteLinking`, `managedAccountRevokeLinking` |
| `managedAccountSyncActivities`, `managedAccountUpdatePin`, `managedAccountGetSponsorAgeVerification` |
| `paymentsPasskeyHasCredential`, `paymentsPasskeyEnrollChallenge`, `paymentsPasskeyEnrollVerify`, `paymentsPasskeyRegisterFinish`, `paymentsPasskeyAuthChallenge` |
| `paymentsPasskeyToggleOn`, `paymentsPasskeyToggleOff`, `paymentsPasskeyToggleChallenge`, `paymentsPasskeyToggleCleanup`, `paymentsPasskeyCleanup`, `paymentsIsAccountRecoverable` |
| `upiSendOtp`, `upiVerifyOtp`, `iplsHandshakeInit`, `iplsClientHello`, `iplsdClientHelloV2`, `iplsdClientInitV2` |

The socket exposes the `MANAGED_ACCOUNT_MEX_IDS` constant.

### Package Exports

The package exports `makeWASocket` as both a named and default export, the `WASocket` type, all generated `WAProto` definitions, and public modules from `Utils`, `Types`, `Defaults`, `WABinary`, `WAM`, `WAUSync`, `Store`, `GraphQL`, and `MEX`. Username types include `FindUserResult`, `SetUsernameOptions`, and `UsernameCheckResult`.

---

## Development and Building

```bash
corepack enable
yarn install
yarn build
yarn lint
yarn test
```

---

## Maintainer and Contact

- Author: **XazepysK**
- GitHub: [https://github.com/xazepysk](https://github.com/xazepysk)
- Telegram: [https://t.me/ZanLugner](https://t.me/ZanLugner)
- Channel: [https://t.me/DasyncH](https://t.me/DasyncH)
- Group Chat: [https://t.me/DsyncGroup](https://t.me/DsyncGroup)
- DiscordL [https://discord.gg/6J7VCCzTM](https://discord.gg/6J7VCCzTM)
- Project: [https://github.com/XazepysK/wbails-v2](https://github.com/XazepysK/wbails-v2)

---

## Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or Meta Platforms, Inc. Use at your own discretion.

## License

Copyright (c) 2026 ZanLugner / XazepysK

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.