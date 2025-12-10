// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Sistema de Adoção! 🐾</h1>{" "}
      <p>Encontre seu novo melhor amigo ou gerencie o sistema.</p>{" "}
      <nav>
        {" "}
        <ul>
          {/* 💡 Altera para a nova rota de Login */}{" "}
          <li>
            <Link to="/login">Login / Cadastro</Link>
          </li>{" "}
          <li>
            <Link to="/animal">Ver Animais</Link>
          </li>{" "}
          <li>
            <Link to="/historico_adocao">Histórico de Adoção</Link>
          </li>{" "}
        </ul>{" "}
      </nav>{" "}
    </div>
  );
};

export default Home;
