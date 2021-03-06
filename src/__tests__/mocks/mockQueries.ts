import { UPDATE_MY_SETTINGS } from "../../graphql/mutation";
import { GET_ME, GET_ME_WITH_FRIENDS } from "../../graphql/queries";
import mockedUsers from "./mockedUsers";

export default [
    {
        request: {
            query: GET_ME,
        },
        result: {
            data: {
                getMe: mockedUsers[0]
            }
        },
    },
    {
        request: {
            query: GET_ME_WITH_FRIENDS,
        },
        result: {
            data: {
                getMe: mockedUsers[0],
            }
        }
    },
    {
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
    }
];