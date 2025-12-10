import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api";

const EyeIcon = ({ onClick, isVisible }) => (
  <span
    onClick={onClick}
    style={{
      cursor: "pointer",
      marginLeft: "5px",
      color: isVisible ? "#dc3545" : "#28a745",
    }}
    title={isVisible ? "Esconder Senha" : "Mostrar Senha"}
  >
    {isVisible ? "🙈" : "👀"}
  </span>
);

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [senhaVisivelMap, setSenhaVisivelMap] = useState({});
  const [usuarioLogado] = useState(
    localStorage.getItem("userName") || "Usuário Admin"
  );

  const navigate = useNavigate();

  const buscarUsuarios = async () => {
    try {
      const response = await api.get("/usuario");
      const dados = response.data?.mensagem || [];
      const usuariosFormatados = dados.map((usuario) => ({
        ...usuario,
        id: usuario.id || usuario.email,
        data_cadastro: usuario.data_cadastro
          ? new Date(usuario.data_cadastro).toLocaleString("pt-BR")
          : "N/A",
        updatedAt: usuario.updatedAt
          ? new Date(usuario.updatedAt).toLocaleString("pt-BR")
          : "N/A",
      }));
      setUsuarios(usuariosFormatados);
    } catch (error) {
      console.error("Erro ao buscar usuário", error);
      setUsuarios([]);
    }
  };

  const excluirUsuario = async (id) => {
    try {
      console.log("excluindo", id);
      const respostaConfirm = confirm("Confirma a exclusão do usuário?");
      console.log("respostaConfirm", respostaConfirm);
      if (respostaConfirm) {
        await api.delete(`/usuario/${id}`);
        alert(`Usuário excluído com sucesso.`);
        buscarUsuarios();
      }
    } catch (err) {
      alert(`Usuário não pôde ser excluído (provávelmente já adotou)`);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const toggleSenhaVisivel = (userId) => {
    setSenhaVisivelMap((prevMap) => ({
      ...prevMap,
      [userId]: !prevMap[userId],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    console.log("Sessão Encerrada e Usuário Deslogado");
    navigate("/login");
  };

  const colunas = useMemo(
    () => [
      { key: "nome", label: "NOME" },
      { key: "cpf", label: "CPF" },
      { key: "email", label: "EMAIL" },
      { key: "senha", label: "SENHA", isPassword: true },
      { key: "data_cadastro", label: "DATA CADASTRO" },
      { key: "updatedAt", label: "ÚLTIMA ATUALIZAÇÃO" },
    ],
    []
  );

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/usuario">
            <b>MEU PET APP</b>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/animal">
                <b>ANIMAIS</b>
              </Nav.Link>
              <Nav.Link as={Link} to="/historico_adocao">
                <b>HISTÓRICO ADOÇÕES</b>
              </Nav.Link>
            </Nav>
            <Nav>
              <b>
                <NavDropdown
                  title={usuarioLogado}
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="text-danger"
                  >
                    <b>SAIR</b>
                  </NavDropdown.Item>
                </NavDropdown>
              </b>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-5">
        <Row>
          <h1 className="mb-4 text-center">
            <b>LISTA DE USUÁRIOS</b>
          </h1>
          <Button variant="success" as={Link} to="/usuario/novo">
            <b>CADASTRAR</b>
          </Button>
        </Row>
        <hr className="mt-2 mb-4" />
        <div className="table-responsive shadow-sm">
          {usuarios.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  {colunas.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th className="text-center">
                    <b>AÇÕES</b>
                  </th>{" "}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, index) => (
                  <tr key={usuario.id || index}>
                    {colunas.map((col) => (
                      <td key={col.key}>
                        {col.isPassword ? (
                          <div className="d-flex align-items-center">
                            {senhaVisivelMap[usuario.id]
                              ? usuario.senha
                              : "********"}
                            <EyeIcon
                              onClick={() => toggleSenhaVisivel(usuario.id)}
                              isVisible={senhaVisivelMap[usuario.id]}
                            />
                          </div>
                        ) : (
                          usuario[col.key]
                        )}
                      </td>
                    ))}
                    <td className="text-center">
                      <Button
                        variant="warning"
                        size="sm"
                        as={Link}
                        to={`/usuario/editar/${usuario.id}`}
                        className="me-2"
                      >
                        <b>DETALHES</b>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => excluirUsuario(usuario.id)}
                      >
                        <b>EXCLUIR</b>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="alert alert-info">
              NENHUM USUÁRIO ENCONTRADO OU ERRO DE CONEXÃO (LOGAR NOVAMENTE)
            </p>
          )}
        </div>
      </Container>
    </>
  );
};

export default Usuario;
