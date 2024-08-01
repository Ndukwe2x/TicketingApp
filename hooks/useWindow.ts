import { useEffect, useState } from 'react';

export const useWindow = () => {
  const [win, setWin] = useState<any>(null);

  useEffect(() => {
    setWin(window);
  }, []);

  return win;
}
