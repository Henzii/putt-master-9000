import { AccountType, User } from "src/types/user";

export const isAdmin = (user: User | null): boolean =>
    user?.accountType === AccountType.ADMIN || user?.accountType === AccountType.GOD;