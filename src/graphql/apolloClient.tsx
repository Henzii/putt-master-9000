import React from 'react';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http';

const API_URL = 'http://192.168.1.3:4000/graphql'

export const client = new ApolloClient<NormalizedCacheObject>({
    link: new HttpLink({
        uri: API_URL,
    }),
    cache: new InMemoryCache() as any,
})

