// src/components/filters/RankFilter.jsx
import React, { useState, useRef, useEffect } from "react";

const RankFilter = ({
  selectedRank,
  onRankChange,
  isRankOpen,
  onToggleRank,
}) => {
  const [searchRank, setSearchRank] = useState("");
  const rankDropdownRef = useRef(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const rankOptions = [
    { name: "Unranked", code: "unranked", icon: "⚪" },
    { name: "Iron", code: "iron", icon: "⚔️" },
    { name: "Bronze", code: "bronze", icon: "🥉" },
    { name: "Silver", code: "silver", icon: "🥈" },
    { name: "Gold", code: "gold", icon: "🥇" },
    { name: "Platinum", code: "platinum", icon: "💎" },
    { name: "Esmerald", code: "esmerald", icon: "🟢" },
    { name: "Diamond", code: "diamond", icon: "💎" },
    { name: "Ascendant", code: "ascendant", icon: "👑" },
    { name: "Immortal", code: "immortal", icon: "🏆" },
    { name: "Radiant", code: "radiant", icon: "🏆" },
  ];

  const searcherRank = (e) => {
    setSearchRank(e.target.value);
  };

  let Rankname = [];
  if (!searchRank) {
    Rankname = rankOptions;
  } else {
    Rankname = rankOptions.filter((dato) =>
      dato.name.toLowerCase().includes(searchRank.toLowerCase())
    );
  }

  const handleRankChange = (rankCode) => {
    if (selectedRank.includes(rankCode)) {
      onRankChange(selectedRank.filter((s) => s !== rankCode));
    } else {
      onRankChange([...selectedRank, rankCode]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isRankOpen &&
        rankDropdownRef.current &&
        !rankDropdownRef.current.contains(event.target)
      ) {
        onToggleRank(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRankOpen, onToggleRank]);

  const toggleComplete = (menu) => {
    onToggleRank(!menu);
    setExpandedFaq(true);
  };

  return (
    <div className="dropdown-container-lol" ref={rankDropdownRef}>
      <button
        className="dropdown-button-lol"
        onClick={() => toggleComplete(isRankOpen)}
      >
        <img src="../../../images/medalla.png" />
        <span className="span-rank"> Rank</span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isRankOpen ? "expanded-lol" : ""
          }`}
        />
      </button>

      {isRankOpen && (
        <div className="dropdown-menu">
          <input
            className="input-rank"
            type="text"
            placeholder="Search"
            value={searchRank}
            onChange={searcherRank}
          />
          <ul>
            {Rankname.map((rank) => (
              <li key={rank.code}>
                <input
                  type="checkbox"
                  checked={selectedRank.includes(rank.code)}
                  onChange={() => handleRankChange(rank.code)}
                />
                <span>{rank.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RankFilter;
