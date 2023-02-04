import { UPDATE_MY_SETTINGS } from "../../graphql/mutation";
import { GET_ME, GET_ME_WITH_FRIENDS } from "../../graphql/queries";
import { User } from "../../hooks/useMe";

export const mockedMe: User = {
    name: 'Mock',
    id: 'id123',
    email: '',
    blockFriendRequests: false,
    blockStatsSharing: false,
    friends:[
        {
            name: 'TestUser2',
            id: 'userid2',
            email: '',
            blockFriendRequests: false,
            blockStatsSharing: false,
            achievements: []
        },
        {
            name: 'TestUser3',
            id: 'userid3',
            email: '',
            blockFriendRequests: false,
            blockStatsSharing: false,
            achievements: []
        }
    ],
    achievements: []
};

export const getMeMock = {
    request: {
        query: GET_ME,
    },
    result: {
        data: {
            getMe: mockedMe
        }
    },
};
export const getMeWithFriendsMock = {
    request: {
        query: GET_ME_WITH_FRIENDS,
    },
    result: {
        data: {
            getMe: mockedMe,
        }
    }
};
export const updateMySettingsMock = {
    request: {
        query: UPDATE_MY_SETTINGS,
        variables: {
            blockFriendRequests: true
        }
    },
    result: {
        data: {
            changeSettings: {
                blockFriendRequests: true
            }
        }
    }
};