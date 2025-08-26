import React from "react";
import "./RoleCard.css"

export function CrewmateCard({ word }: { word: string }) {

    return (
        <div className="role-card">
            <img src="/crewmate.svg" alt="Crewmate Card" className="role-svg" />
            <div className="crewmate-text">{word}</div>
        </div>
    );
}