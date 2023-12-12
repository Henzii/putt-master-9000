import React from 'react';
import Loading from '../components/Loading';
import { render } from '@testing-library/react-native';

jest.useFakeTimers();

describe('<Loading />', () => {
    it('should display "Loading..." as default', () => {
        const { getAllByText, getByTestId } = render(<Loading />);

        expect(getAllByText('Loading...')).toBeDefined();
        expect(getByTestId('progress')).toBeDefined();
    });
    it('should display custom loadingText', () => {
        const { getAllByText, getByTestId } = render(<Loading loadingText='TestingTest'/>);

        expect (getAllByText('TestingTest')).toBeDefined();
        expect(getByTestId('progress')).toBeDefined();
    });

});