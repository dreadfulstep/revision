"use client";

import { createContext, useContext } from "react";

export type User = {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  global_name?: string;
};

const UserContext = createContext<User | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  return ctx;
}