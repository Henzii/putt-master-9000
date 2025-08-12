/* eslint-disable no-undef */
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

/*
    package.json:
    "setupFiles": ["./src/__tests__/mocks/asyncStorageMock.js"]
*/
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-router-native', () => {
    return {
        useNavigate: () => null,
    };
});
jest.mock('react-redux', () => ({
    useDispatch: () => () => null,
    useSelector: jest.fn().mockImplementation(selector => selector({
      common: { loginToken: 'mockedToken' },
      user: {isLoggedIn: true, id: 'mockedId'}
    })),
  }));

jest.mock('graphql-ws', () => ({
    createClient: () => null
}));