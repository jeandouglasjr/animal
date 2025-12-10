import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import Usuario from "./pages/Usuario.jsx";
import NovoUsuario from "./pages/NovoUsuario.jsx";
import EditarUsuario from "./pages/EditarUsuario.jsx";
import Animal from "./pages/Animal.jsx";
import NovoAnimal from "./pages/NovoAnimal.jsx";
import EditarAnimal from "./pages/EditarAnimal.jsx";
import NovoHistoricoAdocao from "./pages/NovoHistorico_Adocao.jsx";
import HistoricoAdocao from "./pages/Historico_Adocao.jsx";
import EditarHistoricoAdocao from "./pages/EditarHistorico_Adocao.jsx";
// 💡 Importe o novo componente de Login
import Login from "./pages/Login.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";

const token = localStorage.getItem("userToken");

const rotas = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/animal",
    element: <Animal />,
  },
  {
    path: "/usuario/novo",
    element: <NovoUsuario />,
  },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/usuario/editar/:id",
        element: <EditarUsuario />,
      },
      {
        path: "/animal/novo",
        element: <NovoAnimal />,
      },
      {
        path: "/animal/editar/:id",
        element: <EditarAnimal />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/usuario",
        element: <Usuario />,
      },
      {
        path: "/historico_adocao",
        element: <HistoricoAdocao />,
      },
      {
        path: "/historico_adocao/novo",
        element: <NovoHistoricoAdocao />,
      },
      {
        path: "/historico_adocao/editar/:id",
        element: <EditarHistoricoAdocao />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>
);
