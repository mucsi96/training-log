import { createContext, FC, useContext, useEffect, useState } from 'react';
import { initGapi, initSheetsApi, initTokenClient } from './gapi';
import { useEffectOnlyOnce } from './useEffectOnlyOnce';

const GoogleAuthProviderContext = createContext<
  google.accounts.oauth2.TokenClient | undefined
>(undefined);

export type GoogleAuthProviderProps = {
  children?: React.ReactNode;
};

export const GoogleAuthProvider: FC<GoogleAuthProviderProps> = ({
  children,
}) => {
  const [tokenClient, setTokenClient] =
    useState<google.accounts.oauth2.TokenClient>();

  useEffectOnlyOnce(() => {
    (async () => {
      await initGapi();
      await initSheetsApi();
      setTokenClient(await initTokenClient());
    })();
  });

  return (
    <GoogleAuthProviderContext.Provider value={tokenClient}>
      {tokenClient ? children : null}
    </GoogleAuthProviderContext.Provider>
  );
};

export function useTokenClient() {
  return useContext(GoogleAuthProviderContext);
}
