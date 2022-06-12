import { FC, useEffect } from 'react';

async function listMajors() {
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

export const Data: FC = () => {
  useEffect(() => {
    (async () => {
      await listMajors();
    })();
  }, []);
  return null;
};
