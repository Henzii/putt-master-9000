import React from 'react';
import { MockedProvider } from "@apollo/react-testing";
import { InMemoryCache } from 'apollo-boost';
import mockQueries from './mockQueries';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Wrapper ({ children }: { children: any }) {
    return (
        <MockedProvider mocks={mockQueries} addTypename={true}
            cache={
                new InMemoryCache({
                    addTypename: false,
                    fragmentMatcher: { match: () => true },
                })
            }
        >
            {children}
        </MockedProvider>
    );
}
