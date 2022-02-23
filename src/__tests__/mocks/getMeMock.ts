import { UPDATE_MY_SETTINGS } from "../../graphql/mutation";
import { GET_ME } from "../../graphql/queries";
import { User } from "../../hooks/useMe";

export const mockedMe: User & { __typename: string } = {
    __typename: 'User',
    name: 'Mock',
    id: 'id123',
    email: '',
    blockFriendRequests: false,
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