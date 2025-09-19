// src/pages/accounts.jsx
import React, { useState, useEffect } from "react";
import { AccountCardValorant } from "../components/AccountCardValorant";
import supabase from "../supabaseClient";
import { NavbarValorant } from "../components/ui/navbarValorant";
import SearchFilter from "../components/filterslol/SearchFilter";
import ServerFilter from "../components/filtersValorant/ServerFilter";
import RankFilter from "../components/filtersValorant/RankFilter";
import PriceFilter from "../components/filterslol/PriceFilter";
import MoreFilters from "../components/filtersValorant/MoreFilters";
import TimeFilter from "../components/filterslol/TimeFilter";
import "../styles/Accountslol.css";

function AccountsPageValorant() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [champions, setChampions] = useState([]);

  // Estados de búsqueda y filtros
  const [search, setSearch] = useState("");
  const [selectedServers, setSelectedServers] = useState([]);
  const [selectedRank, setSelectedRank] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [minChampion, setMinChampion] = useState(0);
  const [maxChampion, setMaxChampion] = useState(27);
  const [minSkins, setMinSkins] = useState(0);
  const [maxSkins, setMaxSkins] = useState(1900);
  const [minBuddies, setMinBuddies] = useState(0);
  const [maxBuddies, setMaxBuddies] = useState(1214);
  const [minVP, setMinVP] = useState(0);
  const [maxVP, setMaxVP] = useState(12000);
  const [minSprays, setMinSprays] = useState(0);
  const [maxSprays, setMaxSprays] = useState(780);
  const [minCards, setMinCards] = useState(0);
  const [maxCards, setMaxCards] = useState(800);
  const [minTitles, setMinTitles] = useState(0);
  const [maxTitles, setMaxTitles] = useState(320);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [minRankWinrate, setMinRankWinrate] = useState(0);
  const [maxRankWinrate, setMaxRankWinrate] = useState(100);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]); // nuevo estado

  // Estados de UI para menús desplegables
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRankOpen, setIsRankOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [isRecomendadosOpen, setIsRecomendadosOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("recomended");

  useEffect(() => {
    document.body.classList.add("fondo-cuentas");

    const fetchAccounts = async () => {
      try {
        let { data, error } = await supabase
          .from("accountValorant")
          .select("*");
        if (error) {
          throw error;
        }
        setAccounts(data || []);
      } catch (error) {
        console.error("Error fetching accounts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      document.body.classList.remove("fondo-cuentas");
    };
  }, []);

  if (loading) {
    return <div>...</div>;
  }

  // Handlers para los filtros
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleServerChange = (servers) => {
    setSelectedServers(servers);
  };

  const handlePlatformChange = (platforms) => {
    setSelectedPlatforms(platforms || []);
  };

  const handleRankChange = (ranks) => {
    setSelectedRank(ranks);
  };

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleChampionChange = (min, max) => {
    setMinChampion(min);
    setMaxChampion(max);
  };

  const handleSkinsChange = (min, max) => {
    setMinSkins(min);
    setMaxSkins(max);
  };

  const handleBuddiesChange = (min, max) => {
    setMinBuddies(min);
    setMaxBuddies(max);
  };

  const handleVPChange = (min, max) => {
    setMinVP(min);
    setMaxVP(max);
  };

  const handleSpraysChange = (min, max) => {
    setMinSprays(min);
    setMaxSprays(max);
  };

  const handleCardsChange = (min, max) => {
    setMinCards(min);
    setMaxCards(max);
  };

  const handleTitlesChange = (min, max) => {
    setMinTitles(min);
    setMaxTitles(max);
  };

  const handleFeaturedChange = (val) => {
    setIsFeaturedOnly(!!val);
  };

  const handleRankWinrateChange = (min, max) => {
    setMinRankWinrate(min);
    setMaxRankWinrate(max);
  };
  const handleLevelChange = (levels) => {
    setSelectedLevel(levels || []);
  }; // nuevo handler

  // Lógica de filtrado
  let resultado = accounts;

  // Aplicar filtro de búsqueda
  if (search) {
    resultado = resultado.filter(
      (dato) =>
        dato.description?.toLowerCase().includes(search.toLowerCase()) ||
        dato.region?.toLowerCase().includes(search.toLowerCase()) ||
        dato.rank?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Aplicar filtro de servidores
  if (selectedServers.length > 0) {
    resultado = resultado.filter((account) =>
      selectedServers.includes(account.region)
    );
  }
  if (selectedPlatforms.length > 0) {
    resultado = resultado.filter((account) =>
      selectedPlatforms.includes(account.plataform)
    );
  }

  // Aplicar filtro de rangos
  if (selectedRank.length > 0) {
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

    resultado = resultado.filter((account) => {
      const accountRankLower = account.rank?.toLowerCase().trim() || "";

      return selectedRank.some((rankCode) => {
        if (rankCode === "unranked") {
          return (
            accountRankLower.includes("unranked") ||
            accountRankLower === "" ||
            !rankOptions.some(
              (option) =>
                option.code !== "unranked" &&
                account.rank?.toLowerCase().includes(option.name.toLowerCase())
            )
          );
        } else {
          const rankInfo = rankOptions.find(
            (option) => option.code === rankCode
          );
          if (!rankInfo) return false;

          const rankNameLower = rankInfo.name.toLowerCase();
          return accountRankLower.includes(rankNameLower);
        }
      });
    });
  }

  // Aplicar filtro de precio
  resultado = resultado.filter(
    (account) => account.price >= minPrice && account.price <= maxPrice
  );

  resultado = resultado.filter(
    (account) => account.agents >= minChampion && account.agents <= maxChampion
  );

  // Aplicar filtro de skins
  resultado = resultado.filter(
    (account) => account.skins >= minSkins && account.skins <= maxSkins
  );
  // Aplicar filtro de Rank Winrate
  resultado = resultado.filter(
    (account) =>
      account.rankedWinrate >= minRankWinrate &&
      account.rankedWinrate <= maxRankWinrate
  );

  // Aplicar filtro por level
  if (selectedLevel.length > 0) {
    resultado = resultado.filter((account) => {
      const lvl = parseInt(account.level, 10);
      const value = Number.isFinite(lvl) ? lvl : 0;
      return selectedLevel.some((code) => {
        switch (code) {
          case "1-29":
            return value >= 1 && value <= 29;
          case "30-50":
            return value >= 30 && value <= 50;
          case "50-100":
            return value >= 50 && value <= 100;
          case "100-200":
            return value >= 100 && value <= 200;
          case "200+":
            return value >= 200;
          default:
            return false;
        }
      });
    });
  }

  // Ordenar por fecha de creación si se ha solicitado
  if (sortOrder === "newest" || sortOrder === "oldest") {
    resultado = resultado.slice().sort((a, b) => {
      // Usar 'fecha_creacion' como prioridad, fallback a 'created_at' u 0
      const ta = new Date(a?.fecha_creacion ?? a?.created_at ?? 0).getTime();
      const tb = new Date(b?.fecha_creacion ?? b?.created_at ?? 0).getTime();
      // Si alguno no es número, mantener orden relativo
      if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 0;
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  } else if (sortOrder === "recomended") {
    resultado;
  }

  // Aplicar filtro de buddies
  resultado = resultado.filter(
    (account) =>
      (account.buddies ?? 0) >= minBuddies &&
      (account.buddies ?? 0) <= maxBuddies
  );

  // Aplicar filtro de VP
  resultado = resultado.filter(
    (account) => (account.vp ?? 0) >= minVP && (account.vp ?? 0) <= maxVP
  );

  // Aplicar filtro de sprays
  resultado = resultado.filter(
    (account) =>
      (account.sprays ?? 0) >= minSprays && (account.sprays ?? 0) <= maxSprays
  );

  // Aplicar filtro de cards
  resultado = resultado.filter(
    (account) =>
      (account.cards ?? 0) >= minCards && (account.cards ?? 0) <= maxCards
  );

  // Aplicar filtro de titles
  resultado = resultado.filter(
    (account) =>
      (account.titles ?? 0) >= minTitles && (account.titles ?? 0) <= maxTitles
  );

  // Aplicar filtro Featured
  if (isFeaturedOnly) {
    resultado = resultado.filter((account) => account.isFeatured === true);
  }

  return (
    <div>
      <NavbarValorant />
      <div className="principal">
        <div className="mini-principal">
          <div className="accounts-container">
            <div className="accounts-page-container">
              <div className="contenedor-titulocuentaslol">
                <div>
                  <img
                    className="imagen-titulocuentaslol"
                    src="../../../images/espartano.png"
                  />
                </div>
                <div className="title-container">
                  <h1>Cuentas de Valorant</h1>
                  <p>Compra tu nueva cuenta de Valorant aquí</p>
                </div>
              </div>
              <div className="title-filters-container">
                <div className="filters-container">
                  <SearchFilter
                    search={search}
                    onSearchChange={handleSearchChange}
                  />

                  <ServerFilter
                    selectedServers={selectedServers}
                    onServerChange={handleServerChange}
                    isMenuOpen={isMenuOpen}
                    onToggleMenu={setIsMenuOpen}
                  />

                  <RankFilter
                    selectedRank={selectedRank}
                    onRankChange={handleRankChange}
                    isRankOpen={isRankOpen}
                    onToggleRank={setIsRankOpen}
                  />

                  <PriceFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={handlePriceChange}
                    isPriceOpen={isPriceOpen}
                    onTogglePrice={setIsPriceOpen}
                  />

                  <MoreFilters
                    isMoreFiltersOpen={isMoreFiltersOpen}
                    onToggleMoreFilters={setIsMoreFiltersOpen}
                    minChampion={minChampion}
                    maxChampion={maxChampion}
                    onChampionChange={handleChampionChange}
                    minSkins={minSkins}
                    maxSkins={maxSkins}
                    onSkinsChange={handleSkinsChange}
                    selectedLevel={selectedLevel} // prop añadida
                    onLevelChange={handleLevelChange} // prop añadida
                    selectedPlatforms={selectedPlatforms}
                    handlePlatformChange={handlePlatformChange}
                    minRankWinrate={minRankWinrate}
                    maxRankWinrate={maxRankWinrate}
                    onRankWinrateChange={handleRankWinrateChange}
                    minBuddies={minBuddies}
                    maxBuddies={maxBuddies}
                    onBuddiesChange={handleBuddiesChange}
                    minVP={minVP}
                    maxVP={maxVP}
                    onVPChange={handleVPChange}
                    minSprays={minSprays}
                    maxSprays={maxSprays}
                    onSpraysChange={handleSpraysChange}
                    minCards={minCards}
                    maxCards={maxCards}
                    onCardsChange={handleCardsChange}
                    minTitles={minTitles}
                    maxTitles={maxTitles}
                    onTitlesChange={handleTitlesChange}
                    isFeaturedOnly={isFeaturedOnly}
                    onFeaturedChange={handleFeaturedChange}
                  />
                  <TimeFilter
                    sortChange={sortOrder}
                    onSortChange={setSortOrder}
                    isOpen={isRecomendadosOpen}
                    onToggle={setIsRecomendadosOpen}
                  />
                </div>
              </div>
              <div></div>
              <div className="accounts-section">
                <div>
                  <div className="accounts-grid">
                    {resultado.map((cuentas) => (
                      <AccountCardValorant
                        className="contenedor"
                        key={cuentas.id}
                        account={cuentas}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsPageValorant;
