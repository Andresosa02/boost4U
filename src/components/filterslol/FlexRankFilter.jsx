// src/components/filters/RankFilter.jsx
import React, { useState } from "react";

const FlexRankFilter = ({ selectedFlexRank, onFlexRankChange, onBack }) => {
  const [searchFlexRank, setSearchFlexRank] = useState("");

  const flexRankOptions = [
    { name: "Unranked", code: "unranked", icon: "⚪" },
    { name: "Iron", code: "iron", icon: "⚔️" },
    { name: "Bronze", code: "bronze", icon: "🥉" },
    { name: "Silver", code: "silver", icon: "🥈" },
    { name: "Gold", code: "gold", icon: "🥇" },
    { name: "Platinum", code: "platinum", icon: "💎" },
    { name: "Esmerald", code: "esmerald", icon: "🟢" },
    { name: "Diamond", code: "diamond", icon: "💎" },
    { name: "Master", code: "master", icon: "👑" },
    { name: "Grandmaster", code: "grandmaster", icon: "🏆" },
    { name: "Challenger", code: "challenger", icon: "🏆" },
  ];

  const searcherFlexRank = (e) => {
    setSearchFlexRank(e.target.value);
  };

  let FlexRankname = [];
  if (!searchFlexRank) {
    FlexRankname = flexRankOptions;
  } else {
    FlexRankname = flexRankOptions.filter((dato) =>
      dato.name.toLowerCase().includes(searchFlexRank.toLowerCase())
    );
  }

  const handleFlexRankChange = (rankCode) => {
    if (selectedFlexRank.includes(rankCode)) {
      onFlexRankChange(selectedFlexRank.filter((s) => s !== rankCode));
    } else {
      onFlexRankChange([...selectedFlexRank, rankCode]);
    }
  };

  return (
    <div className="dropdown-container">
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          ← Volver a Filtros
        </button>
      </div>
      <div className="dropdown-menu-flexRank">
        <input
          className="input-rank"
          type="text"
          placeholder="Search"
          value={searchFlexRank}
          onChange={searcherFlexRank}
        />
        <ul>
          {FlexRankname.map((rank) => (
            <li key={rank.code}>
              <input
                type="checkbox"
                checked={selectedFlexRank.includes(rank.code)}
                onChange={() => handleFlexRankChange(rank.code)}
              />
              <span>{rank.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlexRankFilter;
