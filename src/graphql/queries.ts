import gql from "graphql-tag";
import { CORE_USER_INFO, CORE_GAME_INFO, CORE_SCORECARD_INFO } from "./fragments";

export const GET_LAYOUT_STATS = gql`
query($layoutId: ID!, $playersIds: [ID!]) {
  getLayoutStats(layoutId: $layoutId, playersIds: $playersIds) {
    games
    playerId
    holes {
      index
      count
      best
      average
      eagle
      par
      birdie
      bogey
      doubleBogey
    }
  }
}
`;
export const GET_COURSES = gql`
query ($limit: Int!, $offset: Int!, $search: String, $coordinates: [Float], $maxDistance: Int) {
  getCourses (limit: $limit, offset: $offset, search: $search, coordinates: $coordinates, maxDistance: $maxDistance) {
    hasMore
    nextOffset
    courses {
      name
      id
      canEdit
      distance {
        meters
        string
      }
      location {
        coordinates
      }
      layouts {
        id
        name
        par
        pars
        holes
        canEdit
      }
    }
  }
}
`;
export const GET_ME = gql`
${CORE_USER_INFO}
query {
  getMe {
   ...CoreUserInfo
  }
}`;

export const GET_ME_WITH_FRIENDS = gql`
${CORE_USER_INFO}
  query {
    getMe {
      ...CoreUserInfo
      friends {
        ...CoreUserInfo
      }
    }
  }
`;

export const GET_GAME = gql`
${CORE_GAME_INFO}
${CORE_SCORECARD_INFO}
  query($gameId: ID!) {
    getGame(gameId: $gameId) {
      ...CoreGameInfo
      scorecards {
        ...CoreScorecardInfo
        user {
          id
          name
        }
      }
      myScorecard {
        beers
      }
    }
}
`;
export const GET_OLD_GAMES = gql`
${CORE_GAME_INFO}
  query ($onlyOpenGames: Boolean, $limit: Int, $offset: Int, $search: String) {
    getGames (onlyOpenGames: $onlyOpenGames, limit: $limit, offset: $offset, search: $search) {
      hasMore
      nextOffset
      count
      games {
        ...CoreGameInfo
        myScorecard {
          total
        }
        scorecards {
          total
          plusminus
          user {
            id
            name
          }
        }
      }
    }
  }
`;
export const GET_STATS = gql`
  query ($course: String!, $layout: String!, $userIds: [String]){
    getHc (course: $course, layout: $layout, userIds: $userIds) {
      games
      id
      scores
      hc
    }
  }
`;

export const SEARCH_USER = gql`
  query($search: String!) {
    searchUser(search: $search) {
      users {
        id
        name
      }
      hasMore
    }
  }
`;

export const HANDSHAKE = gql`
  query {
    handShake {
      latestVersion
    }
  }
`;

export const GET_ACHIEVEMENTS = gql`
  query {
    getMe {
      id
      achievements {
        id
        game {
          course
          layout
          startTime
        }
      }
    }
  }
`;