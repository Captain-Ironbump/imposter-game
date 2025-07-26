'use client';

import { useSearchParams } from 'next/navigation';

const GamePage = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return <p>No room ID provided. Please join a room.</p>;
  }

  return (
    <div>
      <h1>Game Room: {roomId}</h1>
      {/* Your game logic and UI */}
    </div>
  );
};

export default GamePage;

