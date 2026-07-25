import { ApolloError } from "@apollo/client";
import { useContext } from "react";
import { SessionContext } from "src/context/SessionProvider";
import { User } from "src/types/user";

type UseSessionOptions =
  | { required?: true }
  | { required: false };

export function useSessionV2(
  options?: { required?: true }
): { user: User; loading: boolean; error?: ApolloError };

export function useSessionV2(
  options: { required: false }
): { user: User | null; loading: boolean; error?: ApolloError };

export function useSessionV2(
  { required = true }: UseSessionOptions = {}
): {
  user: User | null;
  loading: boolean;
  error?: ApolloError;
} {
  const { user, loading, error } = useContext(SessionContext);

  if (required && !loading && !user) {
    throw new Error("useSessionV2 called without a logged in user");
  }

  return {
    user,
    loading,
    error,
  };
}