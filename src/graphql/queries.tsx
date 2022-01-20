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