async function loadScript(id: string, script: string) {
  const existingScript = document.getElementById(id);

  if (!existingScript) {
    const scriptElement = document.createElement('script');
    scriptElement.src = script;
    scriptElement.id = id;
    document.body.appendChild(scriptElement);
    await new Promise((resolve) => {
      scriptElement.onload = resolve;
    });
  }
}

async function initGapi() {
  await loadScript('gapi-client-script', 'https://apis.google.com/js/api.js');
  console.log('gapi loaded');
  await new Promise((resolve) => gapi.load('client', resolve));
  await gapi.client.init({
    apiKey: import.meta.env.VITE_API_KEY,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  });
}

export async function initTokenClient() {
  console.log('initTokenClient');
  await initGapi();
  await loadScript(
    'gsi-client-script',
    'https://accounts.google.com/gsi/client'
  );
  return google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive.file',
    callback: '' as any, // defined later
  });
}

export async function listMajors() {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
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
