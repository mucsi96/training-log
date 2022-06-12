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

async function initGapi() {
  await loadScript('gapi-client-script', 'https://apis.google.com/js/api.js');
  await new Promise((resolve) => gapi.load('client', resolve));
}

export async function initTokenClient() {
  await loadScript(
    'gsi-client-script',
    'https://accounts.google.com/gsi/client'
  );
  await initGapi();
  gapi.client.setApiKey(import.meta.env.VITE_API_KEY);
  gapi.client.load('sheets', 'v4');
  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    callback: '' as any,
  });
  return tokenClient;
}

export async function getToken(
  tokenClient: google.accounts.oauth2.TokenClient
) {
  // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
  await new Promise((resolve, reject) => {
    try {
      // Settle this promise in the response callback for requestAccessToken()
      (tokenClient as any).callback = (resp: google.accounts.oauth2.TokenResponse) => {
        if (resp.error !== undefined) {
          reject(resp);
        }
        // GIS has automatically updated gapi.client with the newly issued access token.
        console.log(
          'gapi.client access token: ' + JSON.stringify(gapi.client.getToken())
        );
        resolve(resp);
      };
      tokenClient.requestAccessToken();
    } catch (err) {
      console.log(err);
    }
  });
}

export async function listMajors() {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '100GpHmID_VxZybOL_lCkdkcafqYIxgkIvMK63QKmZdQ',
    range: '2022!A2:O167',
  });

  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    return;
  }
  // Flatten to string to display
  const output = range.values.reduce(
    (str, row) => `${str}${row[0]}, ${row[4]}\n`,
    'Name, Major:\n'
  );
  console.log(output);
  return output;
}
