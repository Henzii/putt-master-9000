import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Settings from '../screens/Settings';
import Wrapper from './mocks/ApolloMockWrapper';

jest.useFakeTimers();

const wrappedSettings = () => (
       <Wrapper>
            <Settings />
        </Wrapper>
);

describe('<Settings /> test', () => {
    it('block firendrequests switch toggles', async () => {
        const { getByTestId } = render(wrappedSettings());
        const kytkin = getByTestId('blockFriendRequestsSwitch');
        expect(kytkin.props.value).toBeFalsy();

        fireEvent.press(kytkin);

        await waitFor(() => expect(kytkin.props.value).toBeTruthy());
    });
});
