import React from "react";
import "./CrewmateCard.css"

export function CrewmateCard({ word }: { word: string }) {

    return (
        <div className="role-card">
            <img src="/crewmate.svg" alt="Crewmate Card" className="role-svg" />
            <div className="crewmate-text">{word}</div>
        </div>
    );
}