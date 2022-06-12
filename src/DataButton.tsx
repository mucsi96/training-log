import { FC, useEffect } from 'react';
import { getToken, listMajors } from './gapi';
import { useTokenClient } from './TokenClientProvider';

export const DataButton: FC = () => {
  const tokenClient = useTokenClient();

  async function showData() {
    if (!tokenClient) {
      return;
    }

    await getToken(tokenClient);
    await listMajors();
  }

  return (
    <button type="button" onClick={showData}>
      Show data
    </button>
  );
};
