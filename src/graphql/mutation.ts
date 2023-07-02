import gql from "graphql-tag";

export const ADD_LAYOUT = gql`
    mutation ($courseId: ID!, $layout: NewLayout!) {
        addLayout(courseId: $courseId, layout: $layout) {
            id
            name
            layouts {
                id
                name
                par
                pars
                holes
            }
        }
    }
`;
export const ADD_COURSE = gql`
    mutation ($name: String!, $coordinates: InputLocation) {
        addCourse(name: $name, coordinates: $coordinates) {
            id
            name
            layouts {
                id
            }
            distance {
                meters
                string
            }
        }
    }
`;
export const LOGIN = gql`
    mutation($user: String!, $password: String!, $pushToken: String) {
        login(user: $user, password: $password, pushToken: $pushToken)
    }
`;
export const ADD_FRIEND = gql`
    mutation($friendName: String) {
        addFriend(friendName: $friendName)
    }
`;
export const REMOVE_FRIEND = gql`
    mutation($friendId: ID!) {
        removeFriend(friendId: $friendId)
    }
`;
export const CREATE_GAME = gql`
    mutation ($courseId: ID!, $layoutId: ID!) {
        createGame(courseId: $courseId, layoutId: $layoutId)
    }
`;
export const ADD_PLAYERS_TO_GAME = gql`
    mutation ($gameId: ID!, $playerIds: [ID!]!) {
        addPlayersToGame(gameId: $gameId, playerIds: $playerIds) {
            id
        }
    }
`;
export const SET_SCORE = gql`
    mutation($gameId: ID!, $playerId: ID!, $hole: Int!, $value: Int!) {
        setScore(gameId: $gameId, playerId: $playerId, hole: $hole, value: $value) {
            scorecards {
                scores
            }
        }
    }
`;
export const CREATE_USER = gql`
    mutation($name: String!, $password: String!, $email: String) {
        createUser(name: $name, password: $password, email: $email)
    }
`;
export const CLOSE_GAME = gql`
    mutation($gameId: ID!, $reopen: Boolean) {
        closeGame(gameId: $gameId, reopen: $reopen) {
            isOpen
        }
    }
`;
export const SET_BEERS = gql`
    mutation($gameId: ID!, $playerId: ID!, $beers: Int!) {
        setBeersDrank(gameId: $gameId, playerId: $playerId, beers: $beers) {
            user
            scorecard {
                beers
            }
        }
    }
`;
export const UPDATE_MY_SETTINGS = gql`
    mutation($blockFriendRequests: Boolean, $password: String, $blockStatsSharing: Boolean, $groupName: String) {
        changeSettings(blockFriendRequests: $blockFriendRequests, password: $password, blockStatsSharing: $blockStatsSharing, groupName: $groupName ) {
            blockFriendRequests
            blockStatsSharing
            groupName
        }
    }
`;
export const DELETE_ACCOUNT = gql`
    mutation {
        deleteAccount
    }
`;
export const ABANDON_GAME = gql`
    mutation abandonGame($gameId: ID!) {
        abandonGame(gameId: $gameId)
    }
`;