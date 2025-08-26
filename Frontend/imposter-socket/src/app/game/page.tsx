import React, { Suspense } from 'react';
import GamePage from './GamePage'; 

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GamePage />
    </Suspense>
  );
}

export default Page;
