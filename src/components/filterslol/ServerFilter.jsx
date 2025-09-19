// src/components/filters/ServerFilter.jsx
import React, { useState, useRef, useEffect } from "react";

const ServerFilter = ({
  selectedServers,
  onServerChange,
  isMenuOpen,
  onToggleMenu,
}) => {
  const [searchServer, setSearchServer] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const serverDropdownRef = useRef(null);

  const serverOptions = [
    { name: "Europe West", code: "EUW" },
    { name: "Latin America North", code: "LAN" },
    { name: "Latin America South", code: "LAS" },
    { name: "Oceania", code: "OCE" },
  ];

  const searcherServer = (e) => {
    setSearchServer(e.target.value);
  };

  let serverName = [];
  if (!searchServer) {
    serverName = serverOptions;
  } else {
    serverName = serverOptions.filter((dato) =>
      dato.name.toLowerCase().includes(searchServer.toLowerCase())
    );
  }

  const handleServerChange = (serverCode) => {
    if (selectedServers.includes(serverCode)) {
      onServerChange(selectedServers.filter((s) => s !== serverCode));
    } else {
      onServerChange([...selectedServers, serverCode]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        serverDropdownRef.current &&
        !serverDropdownRef.current.contains(event.target)
      ) {
        onToggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, onToggleMenu]);

  const toggleComplete = (menu) => {
    onToggleMenu(!menu);
    setExpandedFaq(true);
  };

  return (
    <div className="dropdown-container-lol" ref={serverDropdownRef}>
      <button
        className="dropdown-button-lol"
        onClick={() => toggleComplete(isMenuOpen)}
      >
        <img src="../../../images/web.png" />
        <span>Server</span>
        <img
          src="../../../images/abajo.png"
          className={`faq-arrow-lol ${
            expandedFaq === isMenuOpen ? "expanded-lol" : ""
          }`}
        />
      </button>

      {isMenuOpen && (
        <div className="dropdown-menu">
          <input
            className="input-servidores"
            type="text"
            placeholder="Search"
            value={searchServer}
            onChange={searcherServer}
          />
          <ul>
            {serverName.map((server) => (
              <li
                className="lista-servidores"
                onClick={() => handleServerChange(server.code)}
                key={server.code}
              >
                <input
                  type="checkbox"
                  checked={selectedServers.includes(server.code)}
                  onChange={() => handleServerChange(server.code)}
                />
                <span>{server.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServerFilter;
