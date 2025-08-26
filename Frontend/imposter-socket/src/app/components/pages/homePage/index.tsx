"use client";
import { useEffect, useState } from "react";
import socket from "@/app/constant/server";
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    socket.emit("getRooms");

    socket.on("roomsList", (roomList: string[]) => {
      setRooms(roomList);
    });

    socket.on("gameStarted", ({ roomId, leader }) => {
      console.log(`Game started in room: ${roomId}`);
      router.push(`/game?roomId=${roomId}&leader=${leader}`);
    });

    return () => {
      socket.off("roomsList");
      socket.off("gameStarted");
    };
  }, [router]);

  const handleCreateRoom = () => {
    socket.emit("createRoom");
  };

  const handleJoinRoom = () => {
    if (selectedRoom) {
      socket.emit("joinRoom", { roomId: selectedRoom });
      console.log(`Joining room: ${selectedRoom}`);
    }
  };

  const handleStartGame = () => {
    if (selectedRoom) {
      socket.emit("startGame");
      console.log(`Starting game in room: ${selectedRoom}`);
    }
  }

  return (
    <main className="min-h-screen flex">
      {/* Left Panel: Room List */}
      <aside className="w-1/2 p-6 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room}
              className={`p-3 rounded cursor-pointer transition ${
                selectedRoom === room
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              {room}
            </li>
          ))}
        </ul>
      </aside>

      {/* Right Panel: Buttons */}
      <section className="w-1/2 p-6 flex flex-col items-center justify-center space-y-6">
        <button
          className="w-1/2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button
          className={`w-1/2 py-3 font-semibold rounded ${
            selectedRoom
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleJoinRoom}
          disabled={!selectedRoom}
        >
          Join Room
        </button>
        <button
          className={`w-1/2 py-3 font-semibold rounded bg-red-600 hover:bg-red-700 text-white"}`}
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </section>
    </main>
  );
};

export default HomePage;
