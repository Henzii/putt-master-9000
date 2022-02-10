import React from 'react';
import Loading from '../components/Loading';
import { render, fireEvent } from '@testing-library/react-native';

describe('<Loading />', () => {
    it('Default tekstinä on Loading...', () => {
        const { getAllByText, debug, getByTestId } = render(<Loading />)
        
        // Loading teksti löytyy
        expect(getAllByText('Loading...')).toBeDefined();
        // Rinkula löytyy
        expect(getByTestId('progress')).toBeDefined();
    })
    it('Propsina annettu teksti välittyy oikein...', () => {
        const { getAllByText, getByTestId } = render(<Loading loadingText='TestingTest'/>)
        
        // Oma teksti löytyy
        expect (getAllByText('TestingTest')).toBeDefined();
        // Rinkulakomponentti löytyy
        expect(getByTestId('progress')).toBeDefined();
    })

})