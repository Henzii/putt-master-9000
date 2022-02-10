import gql from "graphql-tag";

export const GET_COURSES = gql`
query {
    getCourses {
      name
      id
      layouts {
        id
        name
        par
        pars
        holes
      }
    }
  }
`
export const GET_ME = gql`
query {
  getMe {
    id
    name
  }
}`

export const GET_ME_WITH_FRIENDS = gql`
  query {
    getMe {
      id
      name
      friends {
        id
        name
      }
    }
  }
`

export const GET_GAME = gql`
  query($gameId: ID!) {
    getGame(gameId: $gameId) {
      date
      course
      layout
      pars
      par
      holes
      isOpen
      scorecards {
        scores
        total
        beers
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
`
export const GET_OLD_GAMES = gql`
  query {
    getGames {
      date
      course
      layout
      id
      par
      isOpen
      myScorecard {
        total
      }
    }
  }
`