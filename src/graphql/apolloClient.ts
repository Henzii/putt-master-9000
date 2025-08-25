import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const PRODUCTION_URI = "https://fudisc-server.henzi.fi";
const PREVIEW_URI = "https://fudisc-server.henzi.fi";
const DEVELOPMENT_URI = "http://192.168.192.126:4000";

export const getAPIUrl = async () => {
  const localMode =
    (await AsyncStorage.getItem("apiEnv")) || process.env.NODE_ENV;
  if (localMode === "preview") {
    return PREVIEW_URI;
  } else if (localMode === "production") {
    return PRODUCTION_URI;
  }
  return DEVELOPMENT_URI;
};

const httpLink = new HttpLink();

const wsLink = new GraphQLWsLink(
  createClient({
    url: async () => (await getAPIUrl()).replace(/(http)(s)?:\/\//, "ws$2://"),
    retryAttempts: 5,
    connectionParams: async () => {
      const token = await AsyncStorage.getItem("token");
      return {
        Authorization: token ? `bearer ${token}` : "",
      };
    },
  })
);

const authLink = setContext(async (_root: unknown, { headers }) => {
  const token = await AsyncStorage.getItem("token");
  const uri = await getAPIUrl();
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : "",
    },
    uri,
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
