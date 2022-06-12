import { FC, useEffect, useState } from 'react';
import { useEffectOnlyOnce } from './useEffectOnlyOnce';

type DayLog = {
  weight?: number;
  rideElevationGain?: number;
  pushups?: number;
};

async function getTodayLogs(): Promise<DayLog | undefined> {
  const today = new Date();
  const date = today.toLocaleDateString('en-US');
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '100GpHmID_VxZybOL_lCkdkcafqYIxgkIvMK63QKmZdQ',
    range: `${today.getFullYear()}!A2:O366`,
  });

  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    return;
  }

  const { values } = range;

  const row = values.find((row) => row[0] === date);

  if (row) {
    return {
      weight: row[1] && parseFloat(row[1]),
      rideElevationGain: row[2] && parseInt(row[2]),
      pushups: row[3] && parseInt(row[3]),
    };
  }

  return row;
}

export const Data: FC = () => {
  const [todayLogs, setTodayLogs] = useState<DayLog>();
  useEffectOnlyOnce(() => {
    (async () => {
      setTodayLogs(await getTodayLogs());
    })();
  });
  return (
    <div>
      <p>Weight: {todayLogs?.weight} </p>
      <p>Ride elevation gain: {todayLogs?.rideElevationGain} </p>
      <p>Pushups: {todayLogs?.pushups} </p>
    </div>
  );
};
