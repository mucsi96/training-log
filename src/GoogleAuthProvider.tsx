import { createContext, FC, useContext, useEffect, useState } from 'react';
import { initGapi, initSheetsApi, initTokenClient } from './gapi';

const GoogleAuthProviderContext = createContext<
  google.accounts.oauth2.TokenClient | undefined
>(undefined);

export type GoogleAuthProviderProps = {
  children?: React.ReactNode;
};

let tokenClientRequested = false;

export const GoogleAuthProvider: FC<GoogleAuthProviderProps> = ({
  children,
}) => {
  const [tokenClient, setTokenClient] =
    useState<google.accounts.oauth2.TokenClient>();

  useEffect(() => {
    (async () => {
      if (tokenClientRequested) {
        return;
      }

      tokenClientRequested = true;
      await initGapi();
      await initSheetsApi();
      setTokenClient(await initTokenClient());
    })();
  }, [tokenClient]);

  return (
    <GoogleAuthProviderContext.Provider value={tokenClient}>
      {tokenClient ? children : null}
    </GoogleAuthProviderContext.Provider>
  );
};

export function useTokenClient() {
  return useContext(GoogleAuthProviderContext);
}
