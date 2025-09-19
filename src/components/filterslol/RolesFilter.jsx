// src/components/filters/RolesFilter.jsx
import React from "react";

const RolesFilter = ({ selectedRoles, onRolesChange, onBack }) => {
  const roleOptions = [
    { name: "ADC", code: "ADC" },
    { name: "Jungle", code: "JG" },
    { name: "Top", code: "TOP" },
    { name: "Support", code: "SUP" },
    { name: "Mid", code: "MID" },
  ];

  const handleRoleChange = (roleCode) => {
    if (selectedRoles.includes(roleCode)) {
      onRolesChange(selectedRoles.filter((r) => r !== roleCode));
    } else {
      onRolesChange([...selectedRoles, roleCode]);
    }
  };

  return (
    <div>
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          ← Volver a Filtros
        </button>
      </div>
      <div className="dropdown-menu-roles">
        <ul>
          {roleOptions.map((role) => (
            <li key={role.code}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.code)}
                onChange={() => handleRoleChange(role.code)}
              />
              <span>{role.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RolesFilter;
