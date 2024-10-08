'use client';

import { Provider } from "jotai";

interface JotaiProviderProps {
    children: React.ReactNode;
}

//This handles the Jotai Provider as per documentation...
export const JotaiProvider = ({children}:JotaiProviderProps) => {
  return (
    <Provider>
        {children}
    </Provider>
  )
}
