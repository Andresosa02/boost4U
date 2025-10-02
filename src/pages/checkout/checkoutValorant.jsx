import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../../supabaseClient";
import User from "../../components/user";
import "../../styles/checkout.css";

function Checkout() {
  const [merged, setMerged] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // 2. Función para obtener los datos de la cuenta específica
    const fetchAccount = async () => {
      if (!id) return; // Salir si por alguna razón no hay ID

      try {
        const { data, error } = await supabase
          .from("accounts") // Tu tabla
          .select("*") // Selecciona todas las columnas
          .eq("id", id) // 🚨 FILTRA por el ID
          .single(); // Espera un único resultado

        if (error && error.code !== "PGRST116") {
          // PGRST116 es "no rows found"
          setError(error.message);
          setMerged(null);
        } else if (data) {
          setMerged(data);
        } else {
          setError("Cuenta no encontrada.", error.message);
        }
      } catch (error) {
        setError("Error al conectar con Supabase.", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  if (loading) return <div>Cargando detalles de la cuenta...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!merged) return <div>No se encontró la cuenta.</div>;

  const marketplace = 3.41;
  const processor = 0.039;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <aside className="checkout-left">
          <div className="checkout-header">
            <div className="checkout-brand">
              <div>
                <Link to="/">
                  <img
                    src="https://thumbs.dreamstime.com/b/icono-de-la-corona-en-fondo-rojo-ilustraci%C3%B3n-vectorial-estilo-plano-179116854.jpg"
                    alt="Boost4U"
                    className="logo-navbar"
                  />
                </Link>
              </div>
            </div>
            <div>
              <User />
            </div>
          </div>

          <h3 className="checkout-paywith">Pay with</h3>

          <div className="checkout-methods">
            {merged.roles.map((m) => (
              <label key={m} className={"checkout-method"}>
                <div className="checkout-method-left">
                  <span className={`checkout-icon checkout-icon`} />
                  <div className="checkout-method-info">
                    <div className="checkout-method-title">{m}</div>
                  </div>
                </div>
                <span className={"checkout-radio"} />
              </label>
            ))}
          </div>
        </aside>

        <main className="checkout-right">
          <div className="checkout-amountdue">Amount due</div>
          <div className="checkout-totalprice">
            {(
              merged.price +
              marketplace +
              processor * (merged.price + marketplace)
            ).toFixed(2)}
          </div>

          <div className="checkout-item">
            <div className="checkout-item-info">{merged.description}</div>
            <div className="checkout-item-price">{merged.order}</div>
          </div>

          <div className="checkout-warranty">
            <div className="checkout-warranty-left">
              <span className="checkout-warranty-icon">🛡️</span>
              <span className="checkout-warranty-text">
                Get lifetime Warranty
              </span>
            </div>
            <div
              className={
                "checkout-toggle" +
                (merged.isFeatured ? " checkout-toggle--on" : "")
              }
            />
          </div>

          <div className="checkout-breakdown">
            <div className="checkout-row">
              <span>Subtotal</span>
              <span>${merged.price}</span>
            </div>
            <div className="checkout-row checkout-row--muted">
              <span>Marketplace Fee</span>
              <span>+${marketplace}</span>
            </div>
            <div className="checkout-row checkout-row--muted">
              <span>Processor Fee</span>
              <span>+{processor * 100}%</span>
            </div>
          </div>

          <div className="checkout-total">
            <span>Total</span>
            <div className="checkout-total-right">
              <div className="checkout-total-amount">
                {" "}
                {(
                  merged.price +
                  marketplace +
                  processor * (merged.price + marketplace)
                ).toFixed(2)}
              </div>
            </div>
          </div>

          <button className="checkout-paynow">
            <span>Pay Now</span>
            <span className="checkout-paynow-arrow">→</span>
          </button>

          <div className="checkout-ssl">
            🔒 256-bit SSL Encrypted payment. You're safe.
          </div>
        </main>
      </div>
    </div>
  );
}

export default Checkout;
