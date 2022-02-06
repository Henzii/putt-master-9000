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
    mutation ($courseId: ID!, $layoutId: ID!) {
        createGame(courseId: $courseId, layoutId: $layoutId)
    }
`
export const ADD_PLAYERS_TO_GAME = gql`
    mutation ($gameId: ID!, $playerIds: [ID!]!) {
        addPlayersToGame(gameId: $gameId, playerIds: $playerIds) {
            id
        }
    }
`
export const SET_SCORE = gql`
    mutation($gameId: ID!, $playerId: ID!, $hole: Int!, $value: Int!) {
        setScore(gameId: $gameId, playerId: $playerId, hole: $hole, value: $value) {
            scorecards {
                scores
            }
        }
    }
`
export const CREATE_USER = gql`
    mutation($name: String!, $password: String!, $email: String) {
        createUser(name: $name, password: $password, email: $email)
    }
`
export const CLOSE_GAME = gql`
    mutation($gameId: ID!) {
        closeGame(gameId: $gameId) {
            isOpen
        }
    }
`