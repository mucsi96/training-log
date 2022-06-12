import { createContext, FC, useContext, useEffect, useState } from 'react';
import { initTokenClient } from './gapi';

const TokenClientContext = createContext<
  google.accounts.oauth2.TokenClient | undefined
>(undefined);

export type TokenClientProviderProps = {
  children?: React.ReactNode;
};

let tokenClientRequested = false;

export const TokenClientProvider: FC<TokenClientProviderProps> = ({
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
      setTokenClient(await initTokenClient());
    })();
  }, [tokenClient]);

  return (
    <TokenClientContext.Provider value={tokenClient}>
      {tokenClient ? children : null}
    </TokenClientContext.Provider>
  );
};

export function useTokenClient() {
  return useContext(TokenClientContext);
}
