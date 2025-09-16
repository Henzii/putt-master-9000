import gql from "graphql-tag";
import { MEASURED_THROW } from "./fragments";

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
  mutation ($name: String!, $coordinates: InputLocation, $courseId: ID) {
    addCourse(name: $name, coordinates: $coordinates, courseId: $courseId) {
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
  mutation ($user: String!, $password: String!, $pushToken: String) {
    login(user: $user, password: $password, pushToken: $pushToken)
  }
`;
export const ADD_FRIEND = gql`
  mutation ($friendName: String) {
    addFriend(friendName: $friendName)
  }
`;
export const REMOVE_FRIEND = gql`
  mutation ($friendId: ID!) {
    removeFriend(friendId: $friendId)
  }
`;
export const CREATE_GAME = gql`
  mutation (
    $courseId: ID!
    $layoutId: ID!
    $isGroupGame: Boolean
    $bHcMultiplier: Float
  ) {
    createGame(
      courseId: $courseId
      layoutId: $layoutId
      isGroupGame: $isGroupGame
      bHcMultiplier: $bHcMultiplier
    )
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
  mutation ($gameId: ID!, $playerId: ID!, $hole: Int!, $value: Int!) {
    setScore(gameId: $gameId, playerId: $playerId, hole: $hole, value: $value) {
      scorecards {
        plusminus
        user {
          id
        }
        scores
      }
    }
  }
`;
export const CREATE_USER = gql`
  mutation ($name: String!, $password: String!, $email: String) {
    createUser(name: $name, password: $password, email: $email)
  }
`;
export const CLOSE_GAME = gql`
  mutation ($gameId: ID!, $reopen: Boolean) {
    closeGame(gameId: $gameId, reopen: $reopen) {
      isOpen
    }
  }
`;
export const SET_BEERS = gql`
  mutation ($gameId: ID!, $playerId: ID!, $beers: Int!) {
    setBeersDrank(gameId: $gameId, playerId: $playerId, beers: $beers) {
      user
      scorecard {
        beers
      }
    }
  }
`;
export const UPDATE_MY_SETTINGS = gql`
  mutation (
    $blockFriendRequests: Boolean
    $password: String
    $blockStatsSharing: Boolean
    $groupName: String
  ) {
    changeSettings(
      blockFriendRequests: $blockFriendRequests
      password: $password
      blockStatsSharing: $blockStatsSharing
      groupName: $groupName
    ) {
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

export const DELETE_COURSE = gql`
  mutation deleteCourse($courseId: ID!) {
    deleteCourse(courseId: $courseId)
  }
`;

export const SEND_FEEDBACK = gql`
  mutation sendFeedback($email: String, $subject: String!, $text: String!) {
    sendFeedback(email: $email, subject: $subject, text: $text)
  }
`;

export const DELETE_MEASURED_THROW = gql`
  mutation DeleteMeasuredThro($throwId: ID!) {
    deleteMeasuredThrow(throwId: $throwId) {
      ...MeasuredThrow
    }
  }
  ${MEASURED_THROW}
`;

export const ADD_MEASURED_THROW = gql`
  mutation AddMeasuredThrow($measuredThrow: MeasuredThrowInput) {
    addMeasuredThrow(throw: $measuredThrow) {
      ...MeasuredThrow
    }
  }
  ${MEASURED_THROW}
`;

export const GET_UPLOAD_SIGNATURE = gql`
  mutation GetUploadSignature($layoutId: ID!, $holeNumber: Int!) {
    getTeeSignUploadSignature(layoutId: $layoutId, holeNumber: $holeNumber) {
      signature
      apiKey
      publicId
      timestamp
      overwrite
      cloudName
      folder
    }
  }
`;