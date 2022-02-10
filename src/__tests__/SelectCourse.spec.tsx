import React from 'react';

import { render, waitFor, fireEvent } from '@testing-library/react-native';
import SelectCourses from '../components/SelectCourse';
import { MockedProvider } from '@apollo/react-testing';
import { Provider } from 'react-native-paper';
import { getCoursesMocks, testiRadat } from './graphqlMocks';

describe('<SelectCourse /> testit', () => {
    it('Komponentti renreröityy oikein', async () => {
        const onSelect = jest.fn();
        const { getByText, debug, getAllByTestId } = render(
            <Provider>
                <MockedProvider addTypename={false} mocks={[getCoursesMocks]}>
                    <SelectCourses onSelect={onSelect}/>
                </MockedProvider>
            </Provider>
        )
        // Loading... teksti löytyy
        expect(getByText("Loading...")).toBeDefined()

        await waitFor(() => {
            // Molemmat testiradat löytyy
            expect(getByText('Testirata1')).toBeDefined();
            expect(getByText('Testirata2')).toBeDefined();
        })

        // Klikataan ensimmäistä rataa
        fireEvent.press( getAllByTestId('SingleCourse')[0] )

        const layout1 = getByText('Testilayout1')
        
        // Testilayout tulee näkyviin
        expect(layout1).toBeDefined();

        // Klikataan layoutti
        fireEvent.press(layout1);

        // onSelect propsi räjähtää
        expect(onSelect).toHaveBeenCalled();

        // onSelect saa oikeat parametrit, eka = layout, toka = course
        expect(onSelect.mock.calls[0][0]).toEqual(testiRadat[0].layouts[0])
        expect(onSelect.mock.calls[0][1]).toEqual(testiRadat[0])
    })
})