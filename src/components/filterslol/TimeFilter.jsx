import React, { useRef, useEffect } from "react";

export default function TimeFilter({
  sortChange,
  onSortChange,
  isOpen,
  onToggle,
}) {
  const serverDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        serverDropdownRef.current &&
        !serverDropdownRef.current.contains(event.target)
      ) {
        onToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const texto = (txt) => {
    if (txt === "newest") {
      return <span>Newest</span>;
    } else if (txt === "oldest") {
      return <span>Oldest</span>;
    } else if (txt === "recomended") {
      return <span className="span-recomended">Recommended</span>;
    }
  };

  const imagen = (txt) => {
    if (txt === "newest") {
      return <span>Newest</span>;
    } else if (txt === "oldest") {
      return <span>Oldest</span>;
    } else if (txt === "recomended") {
      return <img src="../../../images/brillante.png" />;
    }
  };
  return (
    <div className="dropdown-container-recomendados" ref={serverDropdownRef}>
      <button className="dropdown-button-lol" onClick={() => onToggle(!isOpen)}>
        {imagen(sortChange)}
        {texto(sortChange)}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li
              className="dropdown-button"
              onClick={() => {
                onSortChange("recomended");
                onToggle(false);
              }}
            >
              Recommended
            </li>
            <li
              className="dropdown-button"
              onClick={() => {
                onSortChange("newest");
                onToggle(false);
              }}
            >
              Newest
            </li>
            <li
              className="dropdown-button"
              onClick={() => {
                onSortChange("oldest");
                onToggle(false);
              }}
            >
              Oldest
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
