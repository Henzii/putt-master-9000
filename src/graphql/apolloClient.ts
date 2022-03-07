import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';


const API_URL = (process.env.NODE_ENV === 'development')
    ? 'https://puttmaster.herokuapp.com/graphql'
    : 'http://192.168.1.5:8080/graphql';


const httpLink = new HttpLink({
    uri: API_URL,
});
const authLink = setContext( async (root: unknown, { headers }) => {
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: (token)
                ? `bearer ${token}`
                : ''
        }
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

