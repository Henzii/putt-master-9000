import React from 'react';

import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Game from '../components/Game/Game';
import { MockedProvider } from '@apollo/react-testing';
//import { Provider } from 'react-native-paper';
import { getCoursesMocks, testiPeli } from './graphqlMocks';

const wrappedGame = () => {
    return (
        <MockedProvider mocks={getCoursesMocks} addTypename={false}>
            <Game gameId='g1' />
        </MockedProvider>
    );
};

describe('<Game /> testit', () => {
    it('Alussa loading... teksti', () => {
        const { getByTestId } = render(wrappedGame());
        expect(getByTestId('progress')).toBeDefined();
    });
    it('Radan nimi ja pelaajat löytyvät', async () => {
        const { getByTestId, getByText} = render(wrappedGame());
        await waitFor(() => {
            // Radan nimi löytyy...
            expect(getByTestId('GameRata').children).toContain(testiPeli.course);

            // Molemmat pelaajat löytyy
            expect(getByText(testiPeli.scorecards[0].user.name)).not.toBeNull();
            expect(getByText(testiPeli.scorecards[1].user.name)).not.toBeNull();
        });
    });
});