import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { useSessionV2 } from '@hooks/session/useSessionV2';
import Login from '../screens/Login';
import Wrapper from './mocks/MockWrapper';

const mockDispatch = jest.fn();
const mockNotify = jest.fn();
const mockNavigate = jest.fn();
const mockMutation = jest.fn();

jest.mock('@apollo/client', () => ({
    ...jest.requireActual('@apollo/client'),
    useMutation: jest.fn(),
}));

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

jest.mock('@hooks/session/useSessionV2', () => ({
    useSessionV2: jest.fn(),
}));

jest.mock('@hooks/useNotification', () => ({
    useNotification: () => mockNotify,
}));

jest.mock('react-router-native', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('src/utils/firstTimeLaunched', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue(false),
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<Login />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useMutation as jest.Mock).mockReturnValue([mockMutation, { loading: false }]);
        (useSessionV2 as jest.Mock).mockReturnValue({ user: null, loading: false });
        mockMutation.mockResolvedValue({ data: { login: 'mockedToken' } });
    });

    it('sends the username and password to the login mutation when the button is pressed', async () => {
        const { UNSAFE_getAllByType, getByText } = render(
            <Wrapper>
                <Login />
            </Wrapper>
        );

        const [usernameInput, passwordInput] = UNSAFE_getAllByType(TextInput);

        fireEvent.changeText(usernameInput, 'Testeri');
        fireEvent.changeText(passwordInput, 'abcd123');
        fireEvent.press(getByText('components.login.loginButton'));

        await waitFor(() => {
            expect(mockMutation).toHaveBeenCalledWith({
                variables: {
                    user: 'Testeri',
                    password: 'abcd123',
                },
            });
        });

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'mockedToken');
    });
});