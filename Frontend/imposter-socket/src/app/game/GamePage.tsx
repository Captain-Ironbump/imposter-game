'use client';

import { useSearchParams } from 'next/navigation';
import socket from "@/app/constant/server";
import { useEffect, useState } from 'react';
import { CrewmateCard } from '../components/card/CrewmateCard';
import { ImposterCard } from '../components/card/ImposterCard';

const GamePage = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const leader = searchParams.get('leader');
  const [creator, setCreator] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [word, setWord] = useState<string | null>(null);

  const handleCreator = (creator: string) => {
    setCreator(creator);
  }

  const handleRoundStarted = (data: { word: string}) => {
    setWord(data.word);
  }

  useEffect(() => {
    socket.emit('getRoomCreator', { roomId: roomId });

    socket.on('roomCreator', handleCreator);

    socket.on('roundStarted', handleRoundStarted);

    return () => {
      socket.off('roomCreator', handleCreator);
      socket.off('roundStarted', handleRoundStarted)
    }
  }, []);

  if (!roomId) {
    return <p>No room ID provided. Please join a room.</p>;
  }

  if (!leader) {
    return <p>No leader provided. Please ensure you are in a valid game room.</p>;
  }

  const renderInput = () => (
    <div className="p-4 rounded w-full mb-4"> {/*could add border*/}
      <input
        type="text"
        placeholder="Enter a word"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      {/* New button */}
      <button
        onClick={() => {
          if (inputValue.trim() !== "") {
            socket.emit("startRound", { roomId, leader, inputValue });
            setInputValue("");
          }
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Start Round
      </button>
    </div>
  );  

  const renderWord = () => {
    return (
      <div>
        {word === "Imposter" && (
          <ImposterCard />
        )}
        {word !== null && word !== "Imposter" && (
          <CrewmateCard word={word}></CrewmateCard>
        )}
      </div>
    )
  };

  return (
    <div>
      {creator !== socket.id && word === null && (
        <div className="text-center text-gray-600 text-lg font-medium py-4">
          Waiting for creator...
        </div>
      )}
      {creator === socket.id && word === null && renderInput()}
      {word !== null && renderWord()}
    </div>
  );
};

export default GamePage;

