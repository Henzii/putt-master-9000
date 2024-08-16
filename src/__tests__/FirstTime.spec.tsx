
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FirstTime from '../screens/Frontpage/FirstTime';
import Wrapper from './mocks/ApolloMockWrapper';
import { CREATE_USER } from '../graphql/mutation';

jest.useFakeTimers();

describe('<FirstTime />', () => {
    it('username can be changed manually', async () => {
        const {getByTestId, findAllByText} = render(<Wrapper><FirstTime /></Wrapper>);
        const usernameInputField = getByTestId('username');
        const submitButton = getByTestId('signup');

        fireEvent.changeText(usernameInputField, 'testi123');
        expect(usernameInputField.props.value).toBe('testi123');

        fireEvent.changeText(usernameInputField, 'takenUsername');
        fireEvent(usernameInputField, 'blur');

        expect(await findAllByText('Username - already taken!', {exact: false})).toBeTruthy();
        expect(submitButton.props.accessibilityState.disabled).toBeTruthy();


    }, 1000 * 10);
    it('password should match and not be too short', async () => {
        const {getByTestId, findAllByText} = render(<Wrapper><FirstTime /></Wrapper>);
        const passwordField1 = getByTestId('password1');
        const passwordField2 = getByTestId('password2');
        const submitButton = getByTestId('signup');

        fireEvent.changeText(passwordField1, '123');
        fireEvent(passwordField1, 'blur');

        expect(await findAllByText('Password - Password too short!')).toBeTruthy();
        expect(submitButton.props.accessibilityState.disabled).toBeTruthy();

        fireEvent.changeText(passwordField1, 'SuperDuperPassword123');
        fireEvent.changeText(passwordField2, 'DuperSuperPassword321');
        fireEvent(passwordField2, 'blur');

        expect(await findAllByText("Verify password - Passwords don't match!")).toBeTruthy();
        expect(submitButton.props.accessibilityState.disabled).toBeTruthy();

        fireEvent.changeText(passwordField1, 'SuperDuperPassword123');
        fireEvent.changeText(passwordField2, 'SuperDuperPassword123');
        fireEvent(passwordField2, 'blur');
        expect(submitButton.props.accessibilityState.disabled).toBeFalsy();

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
        const usernameInputField = getByTestId('username');
        const passwordField1 = getByTestId('password1');
        const passwordField2 = getByTestId('password2');
        const submitButton = getByTestId('signup');

        fireEvent.changeText(usernameInputField, 'testUser');
        fireEvent.changeText(passwordField1, 'superPassword123');
        fireEvent.changeText(passwordField2, 'superPassword123');
        fireEvent(passwordField2, 'blur');

        expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
        expect(mockedCreateUser.newData).not.toHaveBeenCalled();
        fireEvent.press(submitButton);
        expect(mockedCreateUser.newData).toHaveBeenCalled();
    });
});