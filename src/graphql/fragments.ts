import gql from "graphql-tag";

export const CORE_USER_INFO = gql`
    fragment CoreUserInfo on User {
        id
        name
        blockFriendRequests
    }
`;

export const CORE_GAME_INFO = gql`
    fragment CoreGameInfo on Game {
        date
        course
        layout
        id
        par
        pars
        isOpen
        holes
    }
`;

export const CORE_SCORECARD_INFO = gql`
    fragment CoreScorecardInfo on Scorecard {
        scores
        total
        beers
        plusminus
    }
`;