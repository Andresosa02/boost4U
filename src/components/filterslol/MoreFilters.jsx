import React, { useState, useRef, useEffect } from "react";
import ChampionsFilter from "./ChampionsFilter";
import SkinsFilter from "./SkinsFilter";
import RolesFilter from "./RolesFilter";
import FlexRankFilter from "./FlexRankFilter";
import LevelFilter from "./LevelFilter"; // nuevo import
import BEFilter from "./BEFilter"; // nuevo import
import RPFilter from "./RPFilter"; // nuevo import

const MoreFilters = ({
  isMoreFiltersOpen,
  onToggleMoreFilters,
  minChampion,
  maxChampion,
  onChampionChange,
  minSkins,
  maxSkins,
  onSkinsChange,
  selectedRoles,
  onRolesChange,
  selectedFlexRank,
  onFlexRankChange,
  selectedLevel, // nuevo prop
  onLevelChange, // nuevo prop
  selectedBE, // nuevo prop
  onBEChange, // nuevo prop
  selectedRP, // nuevo prop
  onRPChange, // nuevo prop
}) => {
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [isChampionsOpen, setIsChampionsOpen] = useState(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);
  const [isFlexRankOpen, setIsFlexRankOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false); // nuevo estado
  const [isBEOpen, setIsBEOpen] = useState(false); // nuevo estado
  const [isRPOpen, setIsRPOpen] = useState(false); // nuevo estado
  const [expandedFaq] = useState(true);
  const moreFiltersDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMoreFiltersOpen &&
        moreFiltersDropdownRef.current &&
        !moreFiltersDropdownRef.current.contains(event.target)
      ) {
        onToggleMoreFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreFiltersOpen, onToggleMoreFilters]);

  const handleToggleMoreFilters = () => {
    const newState = !isMoreFiltersOpen;
    onToggleMoreFilters(newState);
    if (newState) {
      setIsChampionsOpen(false);
      setIsSkinsOpen(false);
      setIsRolesOpen(false);
      setIsFlexRankOpen(false);
      setIsLevelOpen(false);
      setIsBEOpen(false);
      setIsRPOpen(false);
    }
  };

  return (
    <div
      className="dropdown-container-moreFilterslol"
      ref={moreFiltersDropdownRef}
    >
      <button
        className="dropdown-button-morefilterslol"
        onClick={handleToggleMoreFilters}
      >
        <img src="../../../images/morefilters.png" />
        <span className="span-morefilters"> More Filters </span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isMoreFiltersOpen ? "expanded-lol" : ""
          }`}
        />
      </button>

      {isMoreFiltersOpen && (
        <div className="dropdown-menu">
          {!isChampionsOpen &&
            !isSkinsOpen &&
            !isRolesOpen &&
            !isFlexRankOpen &&
            !isLevelOpen &&
            !isBEOpen &&
            !isRPOpen && (
              <ul>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsChampionsOpen(true);
                    setIsSkinsOpen(false);
                    setIsRolesOpen(false);
                    setIsFlexRankOpen(false);
                    setIsLevelOpen(false);
                    setIsBEOpen(false);
                    setIsRPOpen(false);
                  }}
                >
                  <span>Champions</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsSkinsOpen(true);
                    setIsChampionsOpen(false);
                    setIsRolesOpen(false);
                    setIsFlexRankOpen(false);
                    setIsLevelOpen(false);
                    setIsBEOpen(false);
                    setIsRPOpen(false);
                  }}
                >
                  <span>Skins</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsRolesOpen(true);
                    setIsChampionsOpen(false);
                    setIsSkinsOpen(false);
                    setIsFlexRankOpen(false);
                    setIsLevelOpen(false);
                    setIsBEOpen(false);
                    setIsRPOpen(false);
                  }}
                >
                  <span>Roles</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsLevelOpen(true);
                    setIsChampionsOpen(false);
                    setIsSkinsOpen(false);
                    setIsRolesOpen(false);
                    setIsFlexRankOpen(false);
                    setIsBEOpen(false);
                    setIsRPOpen(false);
                  }}
                >
                  <span>Level</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsFlexRankOpen(true);
                    setIsChampionsOpen(false);
                    setIsSkinsOpen(false);
                    setIsRolesOpen(false);
                  }}
                >
                  <span>Flex Rank</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsBEOpen(true);
                    setIsChampionsOpen(false);
                    setIsSkinsOpen(false);
                    setIsRolesOpen(false);
                    setIsFlexRankOpen(false);
                    setIsLevelOpen(false);
                    setIsRPOpen(false);
                  }}
                >
                  <span>Blue Essence</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsRPOpen(true);
                    setIsChampionsOpen(false);
                    setIsSkinsOpen(false);
                    setIsRolesOpen(false);
                    setIsFlexRankOpen(false);
                    setIsLevelOpen(false);
                    setIsBEOpen(false);
                  }}
                >
                  <span>Riot Point</span>
                </li>
              </ul>
            )}

          {isChampionsOpen && (
            <ChampionsFilter
              minChampion={minChampion}
              maxChampion={maxChampion}
              onChampionChange={onChampionChange}
              onBack={() => setIsChampionsOpen(false)}
            />
          )}

          {isSkinsOpen && (
            <SkinsFilter
              minSkins={minSkins}
              maxSkins={maxSkins}
              onSkinsChange={onSkinsChange}
              onBack={() => setIsSkinsOpen(false)}
            />
          )}
          {isRolesOpen && (
            <RolesFilter
              selectedRoles={selectedRoles}
              onRolesChange={onRolesChange}
              onBack={() => setIsRolesOpen(false)}
            />
          )}
          {isFlexRankOpen && (
            <FlexRankFilter
              selectedFlexRank={selectedFlexRank}
              onFlexRankChange={onFlexRankChange}
              onBack={() => setIsFlexRankOpen(false)}
            />
          )}
          {isLevelOpen && (
            <LevelFilter
              selectedLevel={selectedLevel}
              onLevelChange={onLevelChange}
              onBack={() => setIsLevelOpen(false)}
            />
          )}
          {isBEOpen && (
            <BEFilter
              selectedBE={selectedBE}
              onBEChange={onBEChange}
              onBack={() => setIsBEOpen(false)}
            />
          )}
          {isRPOpen && (
            <RPFilter
              selectedRP={selectedRP}
              onRPChange={onRPChange}
              onBack={() => setIsRPOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MoreFilters;
