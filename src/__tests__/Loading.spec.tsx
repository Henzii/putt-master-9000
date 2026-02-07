import React from 'react';
import Loading from '../components/Loading';
import { render } from '@testing-library/react-native';
import Wrapper from './mocks/MockWrapper';

jest.useFakeTimers();

describe('<Loading />', () => {
    it('should display "Loading..." as default', () => {
        const { getAllByText, getByTestId } = render(<Wrapper><Loading /></Wrapper>);

        expect(getAllByText('Loading...')).toBeDefined();
        expect(getByTestId('progress')).toBeDefined();
    });
    it('should display custom loadingText', () => {
        const { getAllByText, getByTestId } = render(<Wrapper><Loading loadingText='TestingTest'/></Wrapper>);

        expect (getAllByText('TestingTest')).toBeDefined();
        expect(getByTestId('progress')).toBeDefined();
    });

});