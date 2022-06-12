import { FC, useEffect, useState } from 'react';
import { Spinner } from './Spinner/Spinner';
import { useEffectOnlyOnce } from './useEffectOnlyOnce';
import styles from './Data.module.css';

const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;

type DayLog = {
  weight?: number;
  rideElevationGain?: number;
  pushups?: number;
  pushupRange: string;
};

async function getTodayLogs(): Promise<DayLog | undefined> {
  const today = new Date();
  const sheet = today.getFullYear();
  const date = today.toLocaleDateString('en-US');
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheet}!A2:O366`,
  });

  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    return;
  }

  const { values } = range;

  const rowIndex = values.findIndex((row) => row[0] === date);

  if (rowIndex) {
    const row = values[rowIndex];
    return {
      weight: row[1] && parseFloat(row[1]),
      rideElevationGain: row[2] && parseInt(row[2]),
      pushups: row[3] && parseInt(row[3]),
      pushupRange: `${sheet}!D${rowIndex + 2}:D${rowIndex + 2}`,
    };
  }
}

async function setPushups(pushupRange: string, count: number): Promise<void> {
  await gapi.client.sheets.spreadsheets.values.update(
    {
      spreadsheetId,
      range: pushupRange,
      valueInputOption: 'USER_ENTERED',
    },
    {
      values: [[count]],
    }
  );
}

export const Data: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [todayLogs, setTodayLogs] = useState<DayLog>();
  useEffectOnlyOnce(() => {
    (async () => {
      setIsLoading(true);
      setTodayLogs(await getTodayLogs());
      setIsLoading(false);
    })();
  });

  async function addPushups(count: number) {
    if (!todayLogs) {
      return;
    }

    setIsLoading(true);
    await setPushups(todayLogs.pushupRange, (todayLogs?.pushups ?? 0) + count);
    setTodayLogs(await getTodayLogs());
    setIsLoading(false);
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <p>{todayLogs?.weight ?? '?'} kg</p>
      <p>{todayLogs?.rideElevationGain ?? 0} m</p>
      <p>{todayLogs?.pushups} reps</p>
      <button type="button" onClick={() => addPushups(1)}>
        +1
      </button>
      <button type="button" onClick={() => addPushups(5)}>
        +5
      </button>
      <button type="button" onClick={() => addPushups(10)}>
        +10
      </button>
    </div>
  );
};
