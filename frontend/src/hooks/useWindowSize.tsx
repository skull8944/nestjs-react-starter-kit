import React, { useEffect, useState } from 'react';

import { debounce } from 'lodash';

interface UseWindowSizeProps {
  useDebounce?: boolean;
  debounceWait?: number;
}

function useWindowSize(props: UseWindowSizeProps = {}) {
  const { useDebounce = false, debounceWait = 300 } = props;

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const syncSize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    const handler = useDebounce ? debounce(syncSize, debounceWait) : syncSize;

    window.addEventListener('resize', debounce(handler, debounceWait));

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return size;
}

export default useWindowSize;
