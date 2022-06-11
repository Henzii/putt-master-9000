import React from 'react';
import AlcConverter from '../components/AlcConverter';
import { render, fireEvent } from '@testing-library/react-native';

import { defaultValues as dv } from '../components/AlcConverter';

describe('<AlcConverter /> testit', () => {
    it('Renderöityy oikein...', () => {
        const puu = render(<AlcConverter />).toJSON();
        expect(puu).toMatchSnapshot();
    });
    it('Laskuri toimii...', () => {
        const { getByTestId } = render(<AlcConverter />);
        const result = getByTestId('beers');
        // Alussa 0
        expect(result.children.join('')).toContain('0 beers');

        // Asetetaan eri arvoja kenttiin
        fireEvent.changeText(getByTestId('long'), '2');
        fireEvent.changeText(getByTestId('strong'), '1');
        fireEvent.changeText(getByTestId('longandstrong'), '3');
        fireEvent.changeText(getByTestId('wine'), '4');
        fireEvent.changeText(getByTestId('normal'), '6');
        // Lasketaan summa em juomille
        let summa =   dv.long.multiplier * 2 +
                        dv.strong.multiplier * 1 +
                        dv.longstrong.multiplier * 3 +
                        dv.wine.multiplier * 4 +
                        dv.normal.multiplier * 6;
        summa = Math.round(summa*100)/100;
        expect(result.children[0]).toContain(summa);
    });
});