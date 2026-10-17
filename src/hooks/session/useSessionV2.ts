import { ApolloError } from "@apollo/client";
import { useContext } from "react";
import { SessionContext } from "src/context/SessionProvider";
import { User } from "src/types/user";

export function useSessionV2(): {
  user: User | null;
  loading: boolean;
  error?: ApolloError;
} {
  const { user, loading, error } = useContext(SessionContext);

  return {
    user,
    loading,
    error,
  };
}