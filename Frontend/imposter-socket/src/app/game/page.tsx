'use client';

import { useSearchParams } from 'next/navigation';
import socket from "@/app/constant/server";
import { useEffect, useState } from 'react';

const GamePage = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const leader = searchParams.get('leader');
  const [creator, setCreator] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  if (!roomId) {
    return <p>No room ID provided. Please join a room.</p>;
  }

  if (!leader) {
    return <p>No leader provided. Please ensure you are in a valid game room.</p>;
  }

  const handleCreator = (creator: string) => {
    setCreator(creator);
  }

  useEffect(() => {
    socket.emit('getRoomCreator', { roomId: roomId });

    socket.on('roomCreator', handleCreator);

    return () => {
      socket.off('roomCreator', handleCreator);
    }
  }, []);

  const renderInput = () => (
    <div className="p-4 rounded w-full mb-4"> {/*could add border*/}
      <input
        type="text"
        placeholder="Enter a word"
        value={inputValue}
        onChange={(e) => {
          const value = e.target.value;
          if (!value.includes(' ')) {
            setInputValue(value);
          }
        }}
        className="border p-2 rounded w-full mb-4"
      />
    </div>
  );  

  return (
    <div>
      {creator !== socket.id && (
        <div className="text-center text-gray-600 text-lg font-medium py-4">
          Waiting for creator...
        </div>
      )}
      {creator === socket.id && renderInput()}
    </div>
  );
};

export default GamePage;

