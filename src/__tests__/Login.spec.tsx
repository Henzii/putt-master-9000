import React from 'react';
import Login from '../components/Login';
import { render, fireEvent } from '@testing-library/react-native';

describe('<Login />>', () => {
    it('Login lomake toimii oikein', () => {
        const loginFunction = jest.fn();
        const { getByText, getByTestId } = render(<Login login={loginFunction} />);

        // Syötetään testitunnukset
        fireEvent.changeText( getByTestId('user'), 'Testeri');
        fireEvent.changeText( getByTestId('password'), 'abcd123');

        // Painetaan login-nappia
        fireEvent.press( getByText('Login'));

        // Loginfunktio laukeaa
        expect(loginFunction).toHaveBeenCalled();

        // Funktion parametrit täsmää
        expect(loginFunction.mock.calls[0][0]).toEqual('Testeri');
        expect(loginFunction.mock.calls[0][1]).toEqual('abcd123');

    });
});