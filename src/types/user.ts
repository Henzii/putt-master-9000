import type { Game } from "./game";

export enum AccountType {
    PLEB = 'pleb',
    ADMIN = 'admin',
    GOD = 'god'
}

export type User = {
    name: string,
    id: number | string,
    email: string | null,
    friends?: User[],
    blockFriendRequests?: boolean,
    blockStatsSharing?: boolean,
    achievements: Achievement[],
    groupName?: string,
    accountType: AccountType
}

export type SafeUser = Pick<User, 'name' | 'id' | 'groupName'>

export type UpdatableUserSettings = Pick<User, 'blockFriendRequests' | 'blockStatsSharing' | 'groupName'> & {password?: string};

export type Achievement = {
    id: string,
    layout_id: string,
    game: Game
}
