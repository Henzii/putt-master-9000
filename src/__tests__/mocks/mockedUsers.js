const user1 = {
    __typename: 'User',
    name: 'TestUser1',
    id: 'userid1',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    achievements: [],
    accountType: 'pleb',
    groupName: 'abc',
};

const user2 = {
    __typename: 'User',
    name: 'TestUser2',
    id: 'userid2',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    achievements: [],
    accountType: 'pleb',
    groupName: 'abc',
};

const user3 = {
    __typename: 'User',
    name: 'TestUser3',
    id: 'userid3',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    achievements: [],
    accountType: 'pleb',
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