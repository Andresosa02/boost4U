import React, { useState, useRef, useEffect } from "react";
import ChampionsFilter from "./ChampionsFilter";
import SkinsFilter from "./SkinsFilter";
import LevelFilter from "./LevelFilter";
import PlataformFilter from "./PlataformFilter";
import RankWinrateFilter from "./RankWinrateFilter";
import BuddiesFilter from "./BuddiesFilter";
import VPFilter from "./VPFilter";
import SpraysFilter from "./SpraysFilter";
import CardsFilter from "./CardsFilter";
import TitlesFilter from "./TitlesFilter";
import FeaturedFilter from "./FeaturedFilter";
const MoreFilters = ({
  isMoreFiltersOpen,
  onToggleMoreFilters,
  minChampion,
  maxChampion,
  onChampionChange,
  minSkins,
  maxSkins,
  onSkinsChange,
  minRankWinrate,
  maxRankWinrate,
  onRankWinrateChange,
  selectedLevel,
  onLevelChange,
  selectedPlatforms,
  handlePlatformChange,
  // nuevos props
  minBuddies,
  maxBuddies,
  onBuddiesChange,
  minVP,
  maxVP,
  onVPChange,
  minSprays,
  maxSprays,
  onSpraysChange,
  minCards,
  maxCards,
  onCardsChange,
  minTitles,
  maxTitles,
  onTitlesChange,
  isFeaturedOnly,
  onFeaturedChange,
}) => {
  const [isChampionsOpen, setIsChampionsOpen] = useState(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRankWinrateOpen, setIsRankWinrateOpen] = useState(false);
  const [isBuddiesOpen, setIsBuddiesOpen] = useState(false);
  const [isVPOpen, setIsVPOpen] = useState(false);
  const [isSpraysOpen, setIsSpraysOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [isTitlesOpen, setIsTitlesOpen] = useState(false);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);
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
      setIsLevelOpen(false);
      setIsMenuOpen(false);
      setIsRankWinrateOpen(false);
      setIsBuddiesOpen(false);
      setIsCardsOpen(false);
      setIsSpraysOpen(false);
      setIsTitlesOpen(false);
      setIsVPOpen(false);
      setIsFeaturedOpen(false);
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
            !isLevelOpen &&
            !isMenuOpen &&
            !isRankWinrateOpen &&
            !isBuddiesOpen &&
            !isVPOpen &&
            !isSpraysOpen &&
            !isCardsOpen &&
            !isTitlesOpen &&
            !isFeaturedOpen && (
              <ul>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsMenuOpen(true);
                  }}
                >
                  <span>Plataform</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsBuddiesOpen(true);
                  }}
                >
                  <span>Buddies</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsVPOpen(true);
                  }}
                >
                  <span>Valorant Points</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsSpraysOpen(true);
                  }}
                >
                  <span>Sprays</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsCardsOpen(true);
                  }}
                >
                  <span>Cards</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsTitlesOpen(true);
                  }}
                >
                  <span>Titles</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsFeaturedOpen(true);
                  }}
                >
                  <span>Featured</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsChampionsOpen(true);
                  }}
                >
                  <span>Agents</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsSkinsOpen(true);
                  }}
                >
                  <span>Skins</span>
                </li>

                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsLevelOpen(true);
                  }}
                >
                  <span>Level</span>
                </li>
                <li
                  className="lista-mas-filtros"
                  onClick={() => {
                    setIsRankWinrateOpen(true);
                  }}
                >
                  <span>Rank Winrate</span>
                </li>
              </ul>
            )}
          {isMenuOpen && (
            <PlataformFilter
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={handlePlatformChange}
              isMenuOpen={isMenuOpen}
              onBack={() => setIsMenuOpen(false)}
            />
          )}

          {isBuddiesOpen && (
            <BuddiesFilter
              minBuddies={minBuddies}
              maxBuddies={maxBuddies}
              onBuddiesChange={onBuddiesChange}
              onBack={() => setIsBuddiesOpen(false)}
            />
          )}

          {isVPOpen && (
            <VPFilter
              minVP={minVP}
              maxVP={maxVP}
              onVPChange={onVPChange}
              onBack={() => setIsVPOpen(false)}
            />
          )}

          {isSpraysOpen && (
            <SpraysFilter
              minSprays={minSprays}
              maxSprays={maxSprays}
              onSpraysChange={onSpraysChange}
              onBack={() => setIsSpraysOpen(false)}
            />
          )}

          {isCardsOpen && (
            <CardsFilter
              minCards={minCards}
              maxCards={maxCards}
              onCardsChange={onCardsChange}
              onBack={() => setIsCardsOpen(false)}
            />
          )}

          {isTitlesOpen && (
            <TitlesFilter
              minTitles={minTitles}
              maxTitles={maxTitles}
              onTitlesChange={onTitlesChange}
              onBack={() => setIsTitlesOpen(false)}
            />
          )}

          {isFeaturedOpen && (
            <FeaturedFilter
              isFeaturedOnly={isFeaturedOnly}
              onFeaturedChange={onFeaturedChange}
              onBack={() => setIsFeaturedOpen(false)}
            />
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

          {isLevelOpen && (
            <LevelFilter
              selectedLevel={selectedLevel}
              onLevelChange={onLevelChange}
              onBack={() => setIsLevelOpen(false)}
            />
          )}

          {isRankWinrateOpen && (
            <RankWinrateFilter
              minRankWinrate={minRankWinrate}
              maxRankWinrate={maxRankWinrate}
              onRankWinrateChange={onRankWinrateChange}
              onBack={() => setIsSkinsOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MoreFilters;
