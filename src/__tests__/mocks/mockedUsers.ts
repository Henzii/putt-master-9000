import { ACCOUNT_TYPE, User } from "../../hooks/useMe";

type MockedUser = User & {
    __typename: string
}

const user1: MockedUser = {
    __typename: 'User',
    name: 'TestUser1',
    id: 'userid1',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    achievements: [],
    accountType: ACCOUNT_TYPE.PLEB,
    groupName: 'abc',
};

const user2: MockedUser = {
    __typename: 'User',
    name: 'TestUser2',
    id: 'userid2',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    achievements: [],
    accountType: ACCOUNT_TYPE.PLEB,
    groupName: 'abc',
};

const user3: MockedUser = {
    __typename: 'User',
    name: 'TestUser3',
    id: 'userid3',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    achievements: [],
    accountType: ACCOUNT_TYPE.PLEB,
    groupName: 'abc',
};

export default [
    {
        ...user1,
        friends: [
            user2,
            user3,
        ]
    },
    {
        ...user2,
        friends: [
            user1,
            user3
        ]
    },
    {
        ...user3,
        friends: [
            user1,
            user2
        ]
    }
];