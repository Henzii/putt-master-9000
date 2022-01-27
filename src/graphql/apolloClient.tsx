import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { setContext } from 'apollo-link-context';
const API_URL = 'http://192.168.1.3:4000/graphql'

const httpLink = new HttpLink({
    uri: API_URL,
})

const authLink = setContext( async (root: unknown, { headers }) => {
    const token = await AsyncStorage.getItem('token')
    return { 
        headers: {
            ...headers,
            authorization: (token)
                ? `bearer ${token}`
                : ''
        }
    }
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})
