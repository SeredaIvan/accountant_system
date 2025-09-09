"use client";

import { SessionProvider } from "next-auth/react";
import { ErrorProvider } from "./ErrorProvider";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ErrorProvider>
        {children}
      </ErrorProvider>
    </SessionProvider>
  );
};
