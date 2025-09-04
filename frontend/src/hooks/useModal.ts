import { useState } from 'react';

const useModal = <T = null>(initData: T | null = null) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(initData);

  const open = (data: T) => {
    setVisible(true);
    setData(data);
  };

  const close = () => {
    setVisible(false);
    setData(initData);
  };

  return { visible, data, open, close };
};

export type UseModal<T = null> = ReturnType<typeof useModal<T>>;

export default useModal;
