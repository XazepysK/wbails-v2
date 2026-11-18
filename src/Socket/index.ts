import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeCommunitiesSocket } from './communities'
import { makeUsernameSocket } from './username'
import { makeGraphQLSocket } from './graphql'
import { makeRegistrationSocket } from './registration'
import { makeManagedAccountSocket } from './managed-account'
import { makeInteropSocket } from './interop'
import { makeAIGroupsSocket } from './aigroups'

// export the last socket layer

const makeWASocket = (config: UserFacingSocketConfig) => {
	const newConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	const sock = makeAIGroupsSocket(makeCommunitiesSocket(newConfig))
	const usernameSocket = makeUsernameSocket(sock)
	const interopSocket = makeInteropSocket(usernameSocket)
	const registrationSocket = makeRegistrationSocket(interopSocket)
	const managedAccountSocket = makeManagedAccountSocket(registrationSocket)
	return makeGraphQLSocket(managedAccountSocket, config)
}

export default makeWASocket
