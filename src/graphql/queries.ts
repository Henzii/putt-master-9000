import gql from "graphql-tag";
import { CORE_USER_INFO, CORE_GAME_INFO, CORE_SCORECARD_INFO } from "./fragments";

export const GET_LAYOUT = gql`
  query($layoutId: ID!) {
    getLayout(layoutId: $layoutId) {
      name
      id
      names
      holes
      canEdit
    }
  }
`;

export const GET_LAYOUT_STATS = gql`
query($layoutId: ID!, $playersIds: [ID!]) {
  getLayoutStats(layoutId: $layoutId, playersIds: $playersIds) {
    games
    playerId
    best
    hc
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
        names
        deprecated
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
        id
        beers
      }
    }
}
${CORE_GAME_INFO}
${CORE_SCORECARD_INFO}
`;
export const GET_OLD_GAMES = gql`
${CORE_GAME_INFO}
  query ($onlyOpenGames: Boolean, $limit: Int, $offset: Int, $search: String, $onlyGroupGames: Boolean) {
    getGames (onlyOpenGames: $onlyOpenGames, limit: $limit, offset: $offset, search: $search, onlyGroupGames: $onlyGroupGames) {
      hasMore
      nextOffset
      count
      games {
        ...CoreGameInfo
        myScorecard {
          total
        }
        scorecards {
          id
          total
          plusminus
          scores
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
  query ($layoutId: ID!, $userIds: [String]){
    getHc (layoutId: $layoutId, userIds: $userIds) {
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
  query ($pushToken: String) {
    handShake (pushToken: $pushToken) {
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

export const BEST_POOL = gql`
    query GetBestPoolForLayout($players: Int!, $layoutId: ID!) {
        getBestPoolForLayout(players: $players, layoutId: $layoutId) {
            totalPar
            totalScore
            gamesCount
            game {
                startTime
                course
                layout
                scorecards {
                    plusminus
                    total
                    user {
                        name
                    }
                }
            }
        }
    }
`;

export const GET_ACTIVITY = gql`
  query GetPastActivity ($year: Int, $userId: ID) {
    getPastActivity(year: $year, userId: $userId) {
      from
      to
      months {
        games
        month
      }
    }
  }
`;
