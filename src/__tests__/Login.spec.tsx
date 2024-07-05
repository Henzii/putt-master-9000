import React from 'react';
import Login from '../components/Login';
import { render, fireEvent } from '@testing-library/react-native';

jest.useFakeTimers();
const mockedMutation = jest.fn();

jest.mock('@apollo/client', () => ({
    useMutation: () => [mockedMutation, {loading: false}]
}));

describe('<Login />', () => {
    it('form functions properly', async () => {

        const { getByTestId } = render(<Login />);

        fireEvent.changeText(getByTestId('user'), 'Testeri');
        fireEvent.changeText(getByTestId('password'), 'abcd123');

        fireEvent.press(getByTestId('LoginButton'));


        expect(mockedMutation).toHaveBeenCalledTimes(1);
        expect(mockedMutation.mock.calls[0][0]).toHaveProperty('variables.user', 'Testeri');
        expect(mockedMutation.mock.calls[0][0]).toHaveProperty('variables.password', 'abcd123');
    });
});