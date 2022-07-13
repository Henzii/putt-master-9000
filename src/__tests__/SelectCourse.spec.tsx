import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-native-paper';
import SelectCourses from '../components/SelectCourse';
import mockedCourses from './mocks/mockedCourses';

const TestComp = () => <Provider><SelectCourses /></Provider>;

jest.mock('react-redux', () => {
    return {
        useDispatch: () => null
    };
});
jest.mock('../hooks/useCourses', () => {
    return () => {
        return {
            courses: mockedCourses,
            loading: false,
            addLayout: () => null,
            addCourse: () => null,
            fetchMore: () => null,
            error: null,
            rest: null
        };
    };
});

describe('<SelectCourse /> testit', () => {
    it('Renderöityy oikein...', async () => {
        const puu = render(<TestComp />).toJSON();
        expect(puu).toMatchSnapshot();
    });
});
