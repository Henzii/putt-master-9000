import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';

const PRODUCTION_URI = 'https://fudisc-server.henzi.fi';
const PREVIEW_URI = 'https://fudisc-dev.herokuapp.com/graphql';
const DEVELOPMENT_URI = 'http://192.168.1.4:8080/graphql';

export const getAPIUrl = async () => {
    const localMode = await AsyncStorage.getItem('apiEnv') || process.env.NODE_ENV;
    if (localMode === 'preview') {
        return PREVIEW_URI;
    }
    else if (localMode === 'production') {
        return PRODUCTION_URI;
    }
    return DEVELOPMENT_URI;
};

const httpLink = new HttpLink();

const authLink = setContext( async (_root: unknown, { headers }) => {
    const token = await AsyncStorage.getItem('token');
    const uri = await getAPIUrl();
    return {
        headers: {
            ...headers,
            authorization: (token)
                ? `bearer ${token}`
                : ''
        },
        uri
    };
});

export const client = new ApolloClient({
    link: (authLink.concat(httpLink as never) as unknown as ApolloLink),
    cache: new InMemoryCache(),
});

