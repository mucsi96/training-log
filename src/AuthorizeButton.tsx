import { FC, useState } from 'react';
import { useTokenClient } from './TokenClientProvider';

export type AuthorizeButtonProps = {
  onAuthorized: () => void;
};

export const AuthorizeButton: FC<AuthorizeButtonProps> = ({ onAuthorized }) => {
  const tokenClient = useTokenClient();
  const [authorized, setAuthorized] = useState(() => !!gapi.client.getToken());

  function handleAuthClick() {
    if (!tokenClient) {
      return;
    }

    (tokenClient as any).callback = async (resp: { error: Error }) => {
      if (resp.error !== undefined) {
        console.error(resp);
        throw resp;
      }

      setAuthorized(true);
      onAuthorized();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {});
      gapi.client.setToken(null);
    }
    setAuthorized(false);
  }

  if (!tokenClient) {
    return null;
  }

  return (
    <>
      <button type="button" onClick={handleAuthClick}>
        {authorized ? 'Refresh' : 'Authorize'}
      </button>
      {authorized && (
        <button type="button" onClick={handleSignoutClick}>
          Sign Out
        </button>
      )}
    </>
  );
};
