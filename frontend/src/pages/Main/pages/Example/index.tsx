import React from 'react';

import { CreatePost, GetPost, SearchPost } from './components';
import { useExampleShallowedStore } from './store';

const ExamplePage: React.FC = () => {
  const { reset } = useExampleShallowedStore((store) => ({ reset: store.reset }));

  // reset store when unmount
  React.useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <>
      <GetPost />

      <SearchPost />

      <CreatePost />
    </>
  );
};

export default ExamplePage;
