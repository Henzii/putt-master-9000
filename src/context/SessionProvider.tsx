import { ApolloError, useQuery } from "@apollo/client";
import { useLoginToken } from "@hooks/session/useLoginToken";
import React, {
  createContext,
  ReactNode,
} from "react";
import { GET_ME } from "src/graphql/queries";
import { User } from "src/types/user";

type SessionContextType = {
  user: User | null;
  loading: boolean;
  error?: ApolloError;
};

export const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
});

export const SessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    token: loginToken,
    loading: tokenLoading,
  } = useLoginToken();

  const {
    data,
    loading: userLoading,
    error,
  } = useQuery(GET_ME, {
    skip: tokenLoading || !loginToken,
    fetchPolicy: "no-cache",
  });

  const loading = tokenLoading || (!!loginToken && userLoading);

  return (
    <SessionContext.Provider
      value={{
        user: error ? null : data?.getMe ?? null,
        loading,
        error,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};