import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';

const PRODUCTION_URI = 'https://puttmaster.herokuapp.com/graphql';
const PREVIEW_URI = 'https://fudisc-dev.herokuapp.com/graphql';
const DEVELOPMENT_URI = 'http://192.168.1.12:8080/graphql';

const getAPIUrl = () => {
    const localMode = process.env.NODE_ENV;
    if (localMode === 'preview') {
        return PREVIEW_URI;
    }
    else if (localMode === 'production') {
        return PRODUCTION_URI;
    }
    return DEVELOPMENT_URI;
};

const httpLink = new HttpLink({ uri: getAPIUrl() });

const authLink = setContext( async (root: unknown, { headers }) => {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: (token)
                ? `bearer ${token}`
                : ''
        },
        uri: getAPIUrl()
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

