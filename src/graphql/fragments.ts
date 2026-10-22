import gql from "graphql-tag";

export const CORE_SAFE_USER_INFO = gql`
  fragment CoreSafeUserInfo on SafeUser {
    id
    name
    groupName
  }
`;

export const CORE_USER_INFO = gql`
  fragment CoreUserInfo on User {
    id
    name
    blockFriendRequests
    blockStatsSharing
    accountType
    groupName
  }
`;

export const CORE_GAME_INFO = gql`
  fragment CoreGameInfo on Game {
    date
    startTime
    endTime
    course
    layout
    id
    par
    pars
    isOpen
    holes
    layout_id
    groupName
    bHcMultiplier
  }
`;

export const CORE_SCORECARD_INFO = gql`
  fragment CoreScorecardInfo on Scorecard {
    id
    scores
    total
    beers
    plusminus
    hc
  }
`;

export const CORE_ACHIEVEMENT_INFO = gql`
  fragment CoreAchievementInfo on Achievement {
    id
    game {
      course
      layout
      startTime
    }
  }
`;

export const MEASURED_THROW = gql`
  fragment MeasuredThrow on MeasuredThrow {
    id
    startingPoint {
      coordinates
      acc
    }
    landingPoint {
      coordinates
      acc
    }
    createdAt
  }
`;

export const RAGE_PUTT_GAME = gql`
  fragment RagePuttGame on RagePuttGame {
    id
    startTime
    endTime
    isFinished
    mode
    scorecards {
      id
      user {
        id
        name
      }
      scores
      points
    }
  }
`;