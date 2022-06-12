async function loadScript(id: string, script: string) {
  const existingScript = document.getElementById(id);

  if (!existingScript) {
    await new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      scriptElement.id = id;
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.body.appendChild(scriptElement);
    });
  }
}

export async function initGapi() {
  await loadScript('gapi-client-script', 'https://apis.google.com/js/api.js');
  await new Promise((resolve) => gapi.load('client', resolve));
}

export async function initSheetsApi() {
  gapi.client.setApiKey(import.meta.env.VITE_API_KEY);
  gapi.client.load('sheets', 'v4');
}

export async function initTokenClient() {
  await loadScript(
    'gsi-client-script',
    'https://accounts.google.com/gsi/client'
  );
  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    callback: '' as any,
  });
  await getToken(tokenClient);
  return tokenClient;
}

export async function getToken(
  tokenClient: google.accounts.oauth2.TokenClient,
  configOverride: google.accounts.oauth2.OverridableTokenClientConfig = {
    prompt: '',
  }
) {
  await new Promise((resolve, reject) => {
    (tokenClient as any).callback = (
      resp: google.accounts.oauth2.TokenResponse
    ) => {
      if (resp.error !== undefined) {
        reject(resp);
      }
      resolve(resp);
    };
    tokenClient.requestAccessToken(configOverride);
  });
}
