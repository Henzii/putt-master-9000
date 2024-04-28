import React from 'react';
import Login from '../components/Login';
import { render, fireEvent } from '@testing-library/react-native';

jest.useFakeTimers();

describe('<Login />', () => {
    it('form functions properly', () => {
        const loginFunction = jest.fn(() => Promise.resolve());
        const { getByTestId } = render(<Login login={loginFunction} />);

        // Syötetään testitunnukset
        fireEvent.changeText(getByTestId('user'), 'Testeri');
        fireEvent.changeText(getByTestId('password'), 'abcd123');

        // Painetaan login-nappia
        fireEvent.press(getByTestId('LoginButton'));

        // Loginfunktio laukeaa
        expect(loginFunction).toHaveBeenCalled();

        // Funktion parametrit täsmää
        expect(loginFunction.mock.calls[0]).toEqual(['Testeri', 'abcd123']);

    });
});