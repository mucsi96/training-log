import { EffectCallback, useEffect, useRef } from 'react';

export function useEffectOnlyOnce(callback: EffectCallback) {
  const calledOnce = useRef(false);

  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    calledOnce.current = true;
    return callback();
  }, []);
}
