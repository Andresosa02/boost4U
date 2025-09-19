// src/pages/accountsFornite.jsx
import React, { useState, useEffect } from "react";
import { AccountCardFornite } from "../components/AccountCardFornite";
import supabase from "../supabaseClient";
import { NavbarFornite } from "../components/ui/navbarFornite";
import SearchFilter from "../components/filtersFornite/SearchFilter";
import PlataformFilter from "../components/filtersFornite/PlataformFilter";
import AccountTypeFilter from "../components/filtersFornite/AccountTypeFilter";
import PriceFilter from "../components/filterslol/PriceFilter";
import SkinsFilter from "../components/filtersFornite/SkinsFilter";
import MoreFilters from "../components/filtersFornite/MoreFilters";
import "../styles/AccountsFornite.css";

function AccountsPageFortnite() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [selectedSkins, setSelectedSkins] = useState([]);

  const [selectedPickaxes, setSelectedPickaxes] = useState([]);
  const [selectedBackBlings, setSelectedBackBlings] = useState([]);
  const [selectedEmotes, setSelectedEmotes] = useState([]);
  const [selectedVBucks, setSelectedVBucks] = useState([]);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountTypeOpen, setIsAccountTypeOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("fondo-cuentas");

    const fetchAccounts = async () => {
      try {
        let { data, error } = await supabase.from("accountFornite").select("*");
        if (error) {
          throw error;
        }
        setAccounts(data || []);
      } catch (error) {
        console.error("Error fetching accounts:", error.message || error);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePlatformChange = (platforms) => {
    setSelectedPlatforms(platforms || []);
  };

  const handleAccountTypeChange = (types) => {
    setSelectedAccountType(types || []);
  };

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleSkinsChange = (ranges) => {
    setSelectedSkins(ranges || []);
  };

  const handlePickaxesChange = (ranges) => {
    setSelectedPickaxes(ranges || []);
  };
  const handleBackBlingsChange = (ranges) => {
    setSelectedBackBlings(ranges || []);
  };
  const handleEmotesChange = (ranges) => {
    setSelectedEmotes(ranges || []);
  };
  const handleVBucksChange = (ranges) => {
    setSelectedVBucks(ranges || []);
  };
  const handleFeaturedChange = (value) => {
    setOnlyFeatured(Boolean(value));
  };

  // Filtrado
  let resultado = accounts.slice();

  if (search) {
    const q = search.toLowerCase();
    resultado = resultado.filter(
      (dato) =>
        String(dato.description || "")
          .toLowerCase()
          .includes(q) ||
        String(dato.entorno || "")
          .toLowerCase()
          .includes(q) ||
        String(dato.accountType || "")
          .toLowerCase()
          .includes(q)
    );
  }

  if (selectedPlatforms.length > 0) {
    resultado = resultado.filter((account) =>
      selectedPlatforms.includes(account.entorno)
    );
  }

  if (selectedAccountType.length > 0) {
    const sel = selectedAccountType.map((s) => String(s).toLowerCase());
    resultado = resultado.filter((account) =>
      sel.includes(String(account.accountType || "").toLowerCase())
    );
  }

  resultado = resultado.filter(
    (account) =>
      Number(account.price || 0) >= Number(minPrice) &&
      Number(account.price || 0) <= Number(maxPrice)
  );

  if (selectedSkins.length > 0) {
    resultado = resultado.filter((account) => {
      const skins = Number(account.skins || 0);
      return selectedSkins.some((code) => {
        switch (code) {
          case "1-50":
            return skins >= 1 && skins <= 50;
          case "50-100":
            return skins >= 50 && skins <= 100;
          case "100-200":
            return skins >= 100 && skins <= 200;
          case "200-500":
            return skins >= 200 && skins <= 500;
          case "500+":
            return skins >= 500;
          default:
            return false;
        }
      });
    });
  }

  const applyRangeFilter = (items, selected, field) => {
    if (!selected || selected.length === 0) return items;
    return items.filter((account) => {
      const val = Number(account[field] || 0);
      return selected.some((code) => {
        switch (code) {
          case "1-50":
            return val >= 1 && val <= 50;
          case "50-100":
            return val >= 50 && val <= 100;
          case "100-200":
            return val >= 100 && val <= 200;
          case "200-500":
            return val >= 200 && val <= 500;
          case "500+":
            return val >= 500;
          default:
            return false;
        }
      });
    });
  };

  resultado = applyRangeFilter(resultado, selectedPickaxes, "pickaxes");
  resultado = applyRangeFilter(resultado, selectedBackBlings, "backBlings");
  resultado = applyRangeFilter(resultado, selectedEmotes, "emotes");

  if (selectedVBucks.length > 0) {
    resultado = resultado.filter((account) => {
      const vb = Number(account.V_Bucks || 0);
      return selectedVBucks.some((code) => {
        switch (code) {
          case "1-500":
            return vb >= 1 && vb <= 500;
          case "500-1000":
            return vb >= 500 && vb <= 1000;
          case "1000-2000":
            return vb >= 1000 && vb <= 2000;
          case "2000-5000":
            return vb >= 2000 && vb <= 5000;
          case "5000+":
            return vb >= 5000;
          default:
            return false;
        }
      });
    });
  }

  if (onlyFeatured) {
    resultado = resultado.filter((account) => account.isFeatured === true);
  }

  return (
    <div>
      <NavbarFornite />
      <div className="principal">
        <div className="mini-principal">
          <div className="accounts-container">
            <div className="accounts-page-container">
              <div className="title-container">
                <h1>Cuentas de Fortnite</h1>
                <p>Compra tu nueva cuenta de Fortnite aquí</p>
              </div>

              <div className="filters-container">
                <SearchFilter
                  search={search}
                  onSearchChange={handleSearchChange}
                />

                <PlataformFilter
                  selectedPlatforms={selectedPlatforms}
                  onPlatformChange={handlePlatformChange}
                  isMenuOpen={isMenuOpen}
                  onToggleMenu={setIsMenuOpen}
                />

                <AccountTypeFilter
                  selectedAccountType={selectedAccountType}
                  onAccountTypeChange={handleAccountTypeChange}
                  isOpen={isAccountTypeOpen}
                  onToggleOpen={setIsAccountTypeOpen}
                />

                <SkinsFilter
                  selectedSkins={selectedSkins}
                  onSkinsChange={handleSkinsChange}
                  isOpen={isSkinsOpen}
                  onToggleOpen={setIsSkinsOpen}
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
                  selectedPickaxes={selectedPickaxes}
                  onPickaxesChange={handlePickaxesChange}
                  selectedBackBlings={selectedBackBlings}
                  onBackBlingsChange={handleBackBlingsChange}
                  selectedEmotes={selectedEmotes}
                  onEmotesChange={handleEmotesChange}
                  selectedVBucks={selectedVBucks}
                  onVBucksChange={handleVBucksChange}
                  onlyFeatured={onlyFeatured}
                  onFeaturedChange={handleFeaturedChange}
                />
              </div>

              <div className="accounts-section">
                <div>
                  <div className="accounts-grid">
                    {resultado.map((cuentas) => (
                      <AccountCardFornite
                        className="contenedor"
                        key={cuentas.id}
                        accountFornite={cuentas}
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

export default AccountsPageFortnite;
