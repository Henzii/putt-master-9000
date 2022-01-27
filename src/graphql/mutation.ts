import gql from "graphql-tag";

export const ADD_LAYOUT = gql`
    mutation ($courseId: ID!, $layout: NewLayout!) {
        addLayout(courseId: $courseId, layout: $layout)
    }
`

export const ADD_COURSE = gql`
    mutation ($name: String!) {
        addCourse(name: $name)
    }
`
export const LOGIN = gql`
    mutation($user: String!, $password: String!) {
        login(user: $user, password: $password)
    }
`
export const ADD_FRIEND = gql`
    mutation($friendName: String) {
        addFriend(friendName: $friendName)
    }
`

export const CREATE_GAME = gql`
    mutation ($layoutId: ID!) {
        createGame(layoutId: $layoutId)
    }
`

export const ADD_PLAYERS_TO_GAME = gql`
    mutation ($gameId: ID!, $playerIds: [ID!]!) {
        addPlayersToGame(gameId: $gameId, playerIds: $playerIds) {
            id
        }
    }
`