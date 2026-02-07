import React from 'react';
import Login from '../components/Login';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Wrapper from './mocks/MockWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.useFakeTimers();

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn((selector) =>
        selector({
            common: {},
            user: {},
        })
    ),
}));

describe('<Login />', () => {
    it('form functions properly', async () => {

        const { getByTestId } = render(<Wrapper withApolloProvider={false}><Login /></Wrapper>);

        fireEvent.changeText(getByTestId('user'), 'Testeri');
        fireEvent.changeText(getByTestId('password'), 'abcd123');

        fireEvent.press(getByTestId('LoginButton'));

        await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

        expect(mockDispatch.mock.calls[1][0].payload?.loginToken).toBe('mockedToken');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'token',
            'mockedToken'
        );

    });
});