import React from 'react';

import { render, fireEvent, act } from '@testing-library/react-native';
import RoundTabs from '../components/RoundTabs';

const testGame = {
    holes: 9,
    scorecards: []
};

jest.useFakeTimers();

describe('<RoundTabs />', () => {
    it('should render tabs', () => {
        const { getAllByTestId } = render(<RoundTabs gameData={testGame} selectedRound={0} setSelectedRound={() => null} />);
        expect(getAllByTestId('SingleTab')).toHaveLength(9);

    });
    it('should fire setSelectedRound when clicked', () => {
        const onTabClick = jest.fn();
        const { getAllByTestId } = render(<RoundTabs gameData={testGame} selectedRound={0} setSelectedRound={onTabClick} />);

        const tabit = getAllByTestId('SingleTab');
        act(() => {
            fireEvent.press(tabit[4]);
        });

        expect(onTabClick).toHaveBeenCalled();
        expect(onTabClick.mock.calls[0][0]).toBe(4);
    });
});