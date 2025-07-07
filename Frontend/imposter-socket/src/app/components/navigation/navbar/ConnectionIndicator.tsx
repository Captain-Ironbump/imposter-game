"use client";
import React, { useEffect, useState } from "react";
import socket from "@/app/constant/server";

const ConnectionIndicator = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleUserInRoom = (roomId: string) => {
      setJoinedRoom(roomId);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("userInRoom", handleUserInRoom);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("userInRoom", handleUserInRoom);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {!isConnected ? (
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      ) : (
        <>
          <span className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-green-700">Connected</span>
          {joinedRoom && (
            <span className="text-sm text-blue-600">Room: {joinedRoom}</span>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionIndicator;
