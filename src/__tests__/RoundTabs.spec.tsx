import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';
//import { Provider } from 'react-native-paper';
import RoundTabs from '../components/RoundTabs';

const testGame = {
    holes: 9,
    scorecards: []
};

describe('<RoundTabs /> testit', () => {
    it('Tabit renderöityvät', () => {
        const { getAllByTestId } = render(<RoundTabs gameData={testGame} selectedRound={0} setSelectedRound={() => null} />);

        // 9 väylää, oletetaan että 9 tabia renderöityy
        expect(getAllByTestId('SingleTab')).toHaveLength(9);

    });
    it('Tabin klikkaus toimii', () => {
        const onTabClick = jest.fn();
        const { getAllByTestId } = render(<RoundTabs gameData={testGame} selectedRound={0} setSelectedRound={onTabClick} />);

        const tabit = getAllByTestId('SingleTab');
        // Klikataan 5. tabia (indeksi 4)
        fireEvent.press(tabit[4]);

        // setSelectedRound aktivoituu
        expect(onTabClick).toHaveBeenCalled();

        // Funktion parametri on klikatun tabin indeksi
        expect(onTabClick.mock.calls[0][0]).toBe(4);
    });
});