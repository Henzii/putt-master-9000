import React from 'react';

import { render, waitFor } from '@testing-library/react-native';
import Game from '../screens/Game/Game';
import { MockedProvider } from '@apollo/react-testing';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../utils/store';
//import { Provider } from 'react-native-paper';
import * as gameMocks from './mocks/gameMocks';
import { InMemoryCache } from 'apollo-boost';

const wrappedGame = () => {
    return (
        <ReduxProvider store={store}>
            <MockedProvider mocks={[gameMocks.mockedQuery]} addTypename={true}
                cache={
                    new InMemoryCache({
                        addTypename: false,
                        fragmentMatcher: { match: () => true },
                    })
                }
            >
                <Game gameId='mockedGame1' />
            </MockedProvider>
        </ReduxProvider>
    );
};

describe('<Game /> testit', () => {
    it('Renderöityy oikein', async () => {
        const { getByText, getByTestId} = render(wrappedGame());

        // Alussa loading-rinkula
        expect(getByText('Loading...')).toBeDefined();

        await waitFor(() => {

            // Radan nimi löytyy...
            expect(getByTestId('GameRata').children).toContain(gameMocks.mockedGame.course);
            // Pelaajan nimi löytyy...
            expect(getByText(gameMocks.mockedGame.scorecards[0].user.name)).not.toBeNull();

        });
    });
});