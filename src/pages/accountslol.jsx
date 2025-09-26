// src/pages/accounts.jsx
import React, { useState, useEffect } from "react";
import { AccountCard } from "../components/AccountCard";
import supabase from "../supabaseClient";
import { Navbarlol } from "../components/ui/navbarlol";
import SearchFilter from "../components/filterslol/SearchFilter";
import ServerFilter from "../components/filterslol/ServerFilter";
import RankFilter from "../components/filterslol/RankFilter";
import PriceFilter from "../components/filterslol/PriceFilter";
import MoreFilters from "../components/filterslol/MoreFilters";
import TimeFilter from "../components/filterslol/TimeFilter";
import "../styles/Accountslol.css";

function AccountsPagelol() {
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
  const [maxChampion, setMaxChampion] = useState(171);
  const [minSkins, setMinSkins] = useState(0);
  const [maxSkins, setMaxSkins] = useState(1900);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedFlexRank, setSelectedFlexRank] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]); // nuevo estado
  const [selectedBE, setSelectedBE] = useState([]); // nuevo estado
  const [selectedRP, setSelectedRP] = useState([]); // nuevo estado

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
        let { data, error } = await supabase.from("accounts").select("*");
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
    console.log(accounts);
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

  const handleRolesChange = (roles) => {
    setSelectedRoles(roles);
  };

  const handleFlexRankChange = (flexRanks) => {
    setSelectedFlexRank(flexRanks);
  };

  const handleLevelChange = (levels) => {
    setSelectedLevel(levels || []);
  }; // nuevo handler

  const handleBEChange = (beRanges) => {
    setSelectedBE(beRanges || []);
  }; // nuevo handler

  const handleRPChange = (rpRanges) => {
    setSelectedRP(rpRanges || []);
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

  if (selectedRoles.length > 0) {
    const selectedNorm = selectedRoles.map((r) =>
      String(r)
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
    );

    const normalizeTokensFromString = (str) => {
      let cleaned = String(str).trim();
      // quitar corchetes/llaves tipo Postgres array: {ADC,TOP} o ["ADC","TOP"]
      if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        cleaned = cleaned.slice(1, -1);
      } else if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
        cleaned = cleaned.slice(1, -1);
      }
      const noQuotes = cleaned.replace(/['"]/g, "");
      const withCommas = noQuotes.replace(/[^A-Za-z0-9]+/g, ",");
      return withCommas
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.toUpperCase());
    };

    const collectRoles = (raw) => {
      const set = new Set();
      const helper = (r) => {
        if (r == null) return;
        if (Array.isArray(r)) {
          r.forEach(helper);
          return;
        }
        if (typeof r === "object") {
          Object.values(r).forEach(helper);
          return;
        }
        // string or primitive
        normalizeTokensFromString(String(r)).forEach((tok) =>
          set.add(tok.replace(/[^A-Z0-9]/g, ""))
        );
      };
      helper(raw);
      return Array.from(set);
    };

    resultado = resultado.filter((account) => {
      const accRoles = collectRoles(account.roles);
      if (accRoles.length === 0) return false;
      return accRoles.some((r) => selectedNorm.includes(r));
    });
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
      { name: "Master", code: "master", icon: "👑" },
      { name: "Grandmaster", code: "grandmaster", icon: "🏆" },
      { name: "Challenger", code: "challenger", icon: "🏆" },
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

  if (selectedFlexRank.length > 0) {
    const FlexRankOptions = [
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

    resultado = resultado.filter((account) => {
      const accountRankLower = account.flexRank?.toLowerCase().trim() || "";

      return selectedFlexRank.some((rankCode) => {
        if (rankCode === "unranked") {
          return (
            accountRankLower.includes("unranked") ||
            accountRankLower === "" ||
            !FlexRankOptions.some(
              (option) =>
                option.code !== "unranked" &&
                account.rank?.toLowerCase().includes(option.name.toLowerCase())
            )
          );
        } else {
          const rankInfo = FlexRankOptions.find(
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

  // Aplicar filtro de champions
  resultado = resultado.filter(
    (account) =>
      account.champions >= minChampion && account.champions <= maxChampion
  );

  // Aplicar filtro de skins
  resultado = resultado.filter(
    (account) => account.skins >= minSkins && account.skins <= maxSkins
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

  // Aplicar filtro por Blue Essence (campo 'be')
  if (selectedBE.length > 0) {
    resultado = resultado.filter((account) => {
      const be = parseInt(account.be, 10);
      const value = Number.isFinite(be) ? be : 0;
      return selectedBE.some((code) => {
        switch (code) {
          case "0-10000":
            return value >= 0 && value <= 10000;
          case "10000-30000":
            return value >= 10000 && value <= 30000;
          case "30000-60000":
            return value >= 30000 && value <= 60000;
          case "60000-100000":
            return value >= 60000 && value <= 100000;
          case "100000+":
            return value >= 100000;
          default:
            return false;
        }
      });
    });
  }

  // Aplicar filtro por Riot Points (campo 'rp')
  if (selectedRP.length > 0) {
    resultado = resultado.filter((account) => {
      const rp = parseInt(account.rp, 10);
      const value = Number.isFinite(rp) ? rp : 0;
      return selectedRP.some((code) => {
        switch (code) {
          case "0-400":
            return value >= 0 && value <= 400;
          case "400-1000":
            return value >= 400 && value <= 1000;
          case "1000-4000":
            return value >= 1000 && value <= 4000;
          case "4000-10000":
            return value >= 4000 && value <= 10000;
          case "10000-20000":
            return value >= 10000 && value <= 20000;
          case "20000+":
            return value >= 20000;
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

  return (
    <div>
      <Navbarlol />
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
                  <h1>Cuentas de League of Legends</h1>
                  <p>Compra tu nueva cuenta de lol aquí</p>
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
                    selectedRoles={selectedRoles}
                    onRolesChange={handleRolesChange}
                    selectedFlexRank={selectedFlexRank}
                    onFlexRankChange={handleFlexRankChange}
                    selectedLevel={selectedLevel} // prop añadida
                    onLevelChange={handleLevelChange} // prop añadida
                    selectedBE={selectedBE} // prop añadida
                    onBEChange={handleBEChange} // prop añadida
                    selectedRP={selectedRP} // prop añadida
                    onRPChange={handleRPChange} // prop añadida
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
                      <AccountCard
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

export default AccountsPagelol;
