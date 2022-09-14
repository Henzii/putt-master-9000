import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';

const PRODUCTION_URI = 'https://puttmaster.herokuapp.com/graphql';
const PREVIEW_URI = 'https://fudisc-dev.herokuapp.com/graphql';
const DEVELOPMENT_URI = 'http://192.168.1.11:8080/graphql';

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

const authLink = setContext( async (root: unknown, { headers }) => {
    const token = await AsyncStorage.getItem('token');
    const uri = await getAPIUrl();
    return {
        headers: {
            ...headers,
            authorization: (token)
                ? `bearer ${token}`
                : ''
        },
        uri: uri
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

