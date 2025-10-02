import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AuthModal from "./Login";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isAuthModalVisible, setIsAuthModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      setIsAuthModalVisible(true);
    }
  }, [isAuthenticated, loading]);

  const hideAuthModal = () => {
    setIsAuthModalVisible(false);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/" replace />
        <AuthModal isVisible={isAuthModalVisible} onClose={hideAuthModal} />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
