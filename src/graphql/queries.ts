import gql from "graphql-tag";
import { CORE_USER_INFO, CORE_GAME_INFO, CORE_SCORECARD_INFO } from "./fragments";


export const GET_COURSES = gql`
query ($limit: Int!, $offset: Int!, $search: String, $coordinates: [Float]) {
  getCourses (limit: $limit, offset: $offset, search: $search, coordinates: $coordinates) {
    hasMore
    nextOffset
    courses {
      name
      id
      distance {
        meters
        string
      }
      layouts {
        id
        name
        par
        pars
        holes
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
  query {
    getGames {
      ...CoreGameInfo
      myScorecard {
        total
      }
    }
  }
`;

export const GET_STATS = gql`
  query ($course: String!, $layout: String!){
    getHc (course: $course, layout: $layout) {
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