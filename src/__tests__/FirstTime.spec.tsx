
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FirstTime from '../screens/Frontpage/FirstTime';
import Wrapper from './mocks/ApolloMockWrapper';
import { CREATE_USER } from '../graphql/mutation';

jest.useFakeTimers();

describe('<FirstTime />', () => {
    it('username can be changed manually', async () => {
        const {getByTestId, findAllByText} = render(<Wrapper><FirstTime /></Wrapper>);
        fireEvent.press(getByTestId('create-account'));

        const usernameInputField = getByTestId('username');

        fireEvent.changeText(usernameInputField, 'testi123');
        expect(usernameInputField.props.value).toBe('testi123');

        fireEvent.changeText(usernameInputField, 'takenusername');

        await act(() => {
            jest.advanceTimersByTime(1000); // Simulate the delay for the username check
        });


        expect(await findAllByText('Username - already taken!', {exact: false})).toBeTruthy();
    });
    it('password should match and not be too short', async () => {
        const {getByTestId, findAllByText} = render(<Wrapper><FirstTime /></Wrapper>);
        fireEvent.press(getByTestId('create-account'));
        fireEvent.press(getByTestId('nextStep'));

        const passwordField1 = getByTestId('password1');
        const passwordField2 = getByTestId('password2');

        fireEvent.changeText(passwordField1, '123');
        fireEvent(passwordField1, 'blur');

        expect(await findAllByText('Password - Password too short!')).toBeTruthy();

        fireEvent.changeText(passwordField1, 'SuperDuperPassword123');
        fireEvent.changeText(passwordField2, 'DuperSuperPassword321');
        fireEvent(passwordField2, 'blur');

        expect(await findAllByText("Verify password - Passwords don't match!")).toBeTruthy();
    });

    it('should call createUser mutation with proper variables when Signup is clicked', () => {
        const mockedCreateUser = {
            request: {
                query: CREATE_USER,
                variables: {
                    name: 'testUser',
                    password: 'superPassword123',
                    email: undefined
                }
            },
            newData: jest.fn(() => ({
                data: null
            }))
        };
        const {getByTestId} = render(<Wrapper extraMocks={[mockedCreateUser]}><FirstTime /></Wrapper>);
        fireEvent.press(getByTestId('create-account'));

        const usernameInputField = getByTestId('username');
        fireEvent.changeText(usernameInputField, 'testUser');

        fireEvent.press(getByTestId('nextStep'));

        const passwordField1 = getByTestId('password1');
        const passwordField2 = getByTestId('password2');
        fireEvent.changeText(passwordField1, 'superPassword123');
        fireEvent.changeText(passwordField2, 'superPassword123');
        fireEvent(passwordField2, 'blur');

        fireEvent.press(getByTestId('nextStep'));

        const submitButton = getByTestId('signup');
        expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
        expect(mockedCreateUser.newData).not.toHaveBeenCalled();
        fireEvent.press(submitButton);
        expect(mockedCreateUser.newData).toHaveBeenCalled();
    });
});