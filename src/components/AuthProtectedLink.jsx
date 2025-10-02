import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AuthModal from "./Login";

const AuthProtectedLink = ({ to, children, className, ...props }) => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsAuthModalVisible(true);
      document.body.style.overflow = "hidden";
    }
  };

  const hideAuthModal = () => {
    setIsAuthModalVisible(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Link to={to} className={className} onClick={handleClick} {...props}>
        {children}
      </Link>

      <AuthModal isVisible={isAuthModalVisible} onClose={hideAuthModal} />
    </>
  );
};

export default AuthProtectedLink;
