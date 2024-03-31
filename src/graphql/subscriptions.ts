import gql from "graphql-tag";
import { CORE_GAME_INFO, CORE_SCORECARD_INFO } from "./fragments";

export const GAME_SUBSCRIPTION = gql`
  subscription($gameId: ID!) {
    gameUpdated(gameId: $gameId) {
      game {
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
      updaterId
    }
  }
${CORE_GAME_INFO}
${CORE_SCORECARD_INFO}
`;