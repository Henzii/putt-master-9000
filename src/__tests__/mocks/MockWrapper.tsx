import React from 'react';
import { I18nextProvider } from "react-i18next";
import i18n from '../../localization/i18n';
import ThemeProvider from '../../context/ThemeProvider';
import ApolloMockWrapper from './ApolloMockWrapper';

type Props = {
    children: React.ReactNode,
    extraMocks?: unknown
    withApolloProvider?: boolean
}

const MockWrappper = ({ children, extraMocks }: Props) => {
  return (
    <I18nextProvider i18n={i18n}>
        <ApolloMockWrapper extraMocks={extraMocks}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        </ApolloMockWrapper>
    </I18nextProvider>
  );
};

export default MockWrappper;