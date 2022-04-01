import React from 'react';
import Login from '../components/Login';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../utils/store';

describe('<Login />>', () => {
    it('Login lomake toimii oikein', () => {
        const loginFunction = jest.fn(() => Promise.resolve());
        const { getByTestId } = render(
            <ReduxProvider store={store}>
                <Login login={loginFunction} />
            </ReduxProvider>
        );

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