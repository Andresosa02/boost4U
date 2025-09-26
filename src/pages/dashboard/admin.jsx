import React, { useState, useEffect } from "react";
import NavbarUsers from "../../components/ui/navbarUsers";
import supabase from "../../supabaseClient";
import { isAdmin } from "../../utils/roles";
import "../../styles/Dashboard.css";

export const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const adminAccess = await isAdmin();
    setHasAccess(adminAccess);
    setLoading(false);

    if (adminAccess) {
      loadData();
    }
  };

  const loadData = async () => {
    await Promise.all([
      loadUsers(),
      loadSellers(),
      loadApplications(),
      loadTransactions(),
      loadAccounts(),
    ]);
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        throw error;
      }
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadSellers = async () => {
    try {
      const { data, error } = await supabase
        .from("profileSellers") // a cambiar a profilesellers
        .select(
          `
          *, 
          user_id (username)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSellers(data || []);
    } catch (error) {
      console.error("Error loading sellers:", error);
    }
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("sellerApplications")
        .select(
          `
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          buyer:buyer_id (
            username
          ),
          seller:seller_id (
            profiles:user_id (
              username
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const loadAccounts = async () => {
    try {
      const [lolAccounts, fortniteAccounts, valorantAccounts] =
        await Promise.all([
          supabase.from("accounts").select("*").limit(10),
          supabase.from("accountFornite").select("*").limit(10),
          supabase.from("accountValorant").select("*").limit(10),
        ]);

      const allAccounts = [
        ...(lolAccounts.data || []).map((acc) => ({
          ...acc,
          game: "League of Legends",
        })),
        ...(fortniteAccounts.data || []).map((acc) => ({
          ...acc,
          game: "Fortnite",
        })),
        ...(valorantAccounts.data || []).map((acc) => ({
          ...acc,
          game: "Valorant",
        })),
      ];

      setAccounts(allAccounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
  };

  const handleApplicationDecision = async (
    applicationId,
    decision,
    reason = ""
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updateData = {
        status: decision,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      };

      if (decision === "rejected") {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from("sellerApplications")
        .update(updateData)
        .eq("id", applicationId);

      if (error) throw error;

      // Si se aprueba, crear el vendedor
      if (decision === "approved") {
        const application = applications.find(
          (app) => app.id === applicationId
        );
        const { error: sellerError } = await supabase
          .from("profileSellers")
          .insert({
            id: application.user_id,
            user_id: application.user_id,
            is_active: true,
          });

        if (sellerError) throw sellerError;
      }

      // Recargar datos
      loadApplications();
      loadSellers();

      alert(
        `Solicitud ${
          decision === "approved" ? "aprobada" : "rechazada"
        } exitosamente`
      );
    } catch (error) {
      console.error("Error processing application:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      loadUsers();
      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    }
  };

  if (loading) {
    return (
      <div>
        <NavbarUsers />
        <div className="contenedor">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div>
        <NavbarUsers />
        <div className="contenedor">
          <div className="access-denied">
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarUsers />
      <div className="contenedor">
        <h1>Panel de Administración</h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Usuarios ({users.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "sellers" ? "active" : ""}`}
            onClick={() => setActiveTab("sellers")}
          >
            Vendedores ({sellers.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "applications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("applications")}
          >
            Solicitudes ({applications.length})
          </button>
          <button
            className={`admin-tab ${
              activeTab === "transactions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transacciones ({transactions.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            Cuentas ({accounts.length})
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "users" && (
            <div className="admin-section">
              <h2>Usuarios Registrados</h2>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Register's Date</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <img
                              src={user.avatar_url}
                              alt="Avatar"
                              className="user-avatar-small"
                            />
                            <span>{user.username}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="btn-danger"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "sellers" && (
            <div className="admin-section">
              <h2>Vendedores Activos</h2>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Vendedor</th>
                      <th>Ventas Totales</th>
                      <th>Ganancias</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((seller) => (
                      <tr key={seller.id}>
                        <td>
                          <div className="user-info">
                            <span>{seller.user_id?.username}</span>
                          </div>
                        </td>
                        <td>{seller.total_sales}</td>
                        <td>${seller.total_earnings}</td>
                        <td>
                          <span
                            className={`status ${
                              seller.is_active ? "active" : "inactive"
                            }`}
                          >
                            {seller.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <button className="btn-secondary">
                            {seller.is_active ? "Desactivar" : "Activar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="admin-section">
              <h2>Solicitudes de Vendedores</h2>
              <div className="applications-grid">
                {applications.map((application) => (
                  <div key={application.id} className="application-card">
                    <div className="application-header">
                      <h3>
                        {application.first_name} {application.last_name}
                      </h3>
                      <span className="application-date">
                        {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="application-details">
                      <p>
                        <strong>Email:</strong> {application.email}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {application.phone}
                      </p>
                      <p>
                        <strong>Usuario:</strong>{" "}
                        {application.profiles?.username}
                      </p>
                    </div>
                    <div className="application-actions">
                      <button
                        className="btn-success"
                        onClick={() =>
                          handleApplicationDecision(application.id, "approved")
                        }
                      >
                        Aprobar
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => {
                          const reason = prompt("Razón del rechazo:");
                          if (reason) {
                            handleApplicationDecision(
                              application.id,
                              "rejected",
                              reason
                            );
                          }
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="admin-section">
              <h2>Transacciones</h2>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Comprador</th>
                      <th>Vendedor</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.id.slice(0, 8)}...</td>
                        <td>{transaction.buyer?.username}</td>
                        <td>{transaction.seller?.profiles?.username}</td>
                        <td>${transaction.amount}</td>
                        <td>
                          <span className={`status ${transaction.status}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>
                          {new Date(
                            transaction.created_at
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "accounts" && (
            <div className="admin-section">
              <h2>Cuentas Publicadas</h2>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Juego</th>
                      <th>Detalles</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.game}</td>
                        <td>
                          {account.game === "League of Legends" && (
                            <span>
                              {account.rank} - {account.server}
                            </span>
                          )}
                          {account.game === "Fortnite" && (
                            <span>
                              {account.account_type} - {account.platform}
                            </span>
                          )}
                          {account.game === "Valorant" && (
                            <span>
                              {account.rank} - {account.server}
                            </span>
                          )}
                        </td>
                        <td>${account.price}</td>
                        <td>
                          <span
                            className={`status ${
                              account.is_available ? "available" : "sold"
                            }`}
                          >
                            {account.is_available ? "Disponible" : "Vendida"}
                          </span>
                        </td>
                        <td>
                          {new Date(
                            account.published_at || account.created_at
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
