// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token e o nome de usuário do armazenamento local
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");

    // Redireciona para a tela de login
    navigate("/login");

    // Opcional: Recarrega a página para limpar o estado global da aplicação
    window.location.reload();
  };

  return (
    <NavDropdown.Item onClick={handleLogout}>Sair do Sistema</NavDropdown.Item>
  );
};

export default LogoutButton;
