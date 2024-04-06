type GraphQLError = {
    name: string
    graphQLErrors: {
        message: string
    }[]
}

const isGraphQLError = (error: unknown): error is GraphQLError => 'graphQLErrors' in (error as GraphQLError);

export const extractApolloErrorMessage = (unknownError: unknown): string | null => {
    if (!isGraphQLError(unknownError)) return null;

    return unknownError.graphQLErrors[0]?.message ?? null;
};
