import { createContext, useContext } from "react";
import { User } from "src/types/user";

const AuthenticatedUserContext = createContext<User | null>(null);

export const useAuthenticatedUser = (): User => {
  const user = useContext(AuthenticatedUserContext);

  if (user === null) {
    throw new Error("useAuthenticatedUser must be used within an authenticated route");
  }

  return user;
};

export default AuthenticatedUserContext;
