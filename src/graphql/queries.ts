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
      course
      layout
      pars
      holes
      scorecards {
        scores
        user {
          id
          name
        }
      }
    }
}
`
export const GET_OLD_GAMES = gql`
  query {
    getGames {
      course
      layout
      id
    }
  }
`