import gql from "graphql-tag";

export const ADD_LAYOUT = gql`
    mutation ($courseId: ID!, $layout: NewLayout!) {
        addLayout(courseId: $courseId, layout: $layout)
    }
`

export const ADD_COURSE = gql`
    mutation ($name: String!) {
        addCourse(name: $name)
    }
`