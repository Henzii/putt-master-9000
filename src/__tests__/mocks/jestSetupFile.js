/* eslint-disable no-undef */
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';


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

jest.mock('@hooks/session/useSessionV2', () => ({
    useSessionV2: jest.fn().mockReturnValue({
        user: {
            id: 'mockedId',
            name: 'Mock User',
            email: null,
            accountType: 'pleb',
            achievements: [],
        },
        loading: false,
        error: undefined,
    }),
}));

jest.mock('graphql-ws', () => ({
    createClient: () => null
}));


jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('@expo/vector-icons', () => {
  return {
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    MaterialIcons: 'MaterialIcons',
    Ionicons: 'Ionicons',
    FontAwesome: 'FontAwesome',
  };
});

jest.mock('react-native-paper', () => {
  const ActualPaper = jest.requireActual('react-native-paper');
  return {
    ...ActualPaper,
    Icon: 'Icon',
    List: {
      ...ActualPaper.List,
      Icon: 'ListIcon',
      Item: 'ListItem',
      Section: 'ListSection',
      Subheader: 'ListSubheader',
    },
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: ({ testID, ...props }) => React.createElement('Icon', { testID, ...props }),
  };
});

jest.mock('react-native-paper/lib/module/components/MaterialCommunityIcon', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  return {
    __esModule: true,
    default: ({ testID, ...props }) => React.createElement('Icon', { testID, ...props }),
  };
});