import React from 'react';
import { MockedProvider } from "@apollo/react-testing";
import { InMemoryCache } from '@apollo/client';
import mockQueries from './mockQueries';

const cache = new InMemoryCache();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Wrapper ({ children }: { children: any }) {
    return (
        <MockedProvider mocks={mockQueries} addTypename={true} cache={cache}
        >
            {children}
        </MockedProvider>
    );
}
