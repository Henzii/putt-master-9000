import gql from "graphql-tag";

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