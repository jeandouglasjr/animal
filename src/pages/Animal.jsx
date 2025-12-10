import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const calcularIdade = (dataNascimentoString) => {
  if (!dataNascimentoString) return "N/A";
  const dataNascimento = new Date(dataNascimentoString);
  if (isNaN(dataNascimento.getTime())) return "N/A";
  const dataAtual = new Date();
  let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = dataAtual.getMonth();
  const mesNascimento = dataNascimento.getMonth();
  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento &&
      dataAtual.getDate() < dataNascimento.getDate())
  ) {
    idade--;
  }
  return idade;
};

const Animal = () => {
  const [animais, setAnimais] = useState([]);
  const [busca, setBusca] = useState("");
  const [usuarioLogado] = useState(
    localStorage.getItem("userName") || "Usuário Admin"
  );

  const buscarAnimais = async () => {
    try {
      const response = await api.get("/animal");
      const dados = response.data?.mensagem || [];
      const animaisFormatados = dados.map((animal) => ({
        ...animal,
        id: animal.id,
        idade: calcularIdade(animal.nascimento),
        data_cadastro: animal.data_cadastro
          ? new Date(animal.data_cadastro).toLocaleDateString()
          : "N/A",
        updatedAt: animal.updatedAt
          ? new Date(animal.updatedAt).toLocaleDateString()
          : "N/A",
      }));
      setAnimais(animaisFormatados);
    } catch (error) {
      console.error("Erro ao buscar animais", error);
      alert("Falha ao buscar a lista de animais. Verifique sua autenticação.");
    }
  };

  const excluirAnimal = async (id) => {
    try {
      console.log("excluindo", id);
      const respostaConfirm = confirm("CONFIRMA A EXCLUSÃO DO ANIMAL?");
      console.log("respostaConfirm", respostaConfirm);
      if (respostaConfirm) {
        await api.delete(`/animal/${id}`);
        alert(`ANIMAL EXCLUÍDO!`);
        buscarUsuarios();
      }
    } catch (err) {
      alert(`ANIMAL NÃO PÔDE SER EXCLUÍDO (PROVAVELMENTE JÁ ADOTADO)`);
    }
  };

  useEffect(() => {
    buscarAnimais();
  }, []);

  const colunas = useMemo(
    () => [
      { key: "nome", label: "NOME" },
      { key: "especie", label: "ESPÉCIE" },
      { key: "raca", label: "RAÇA" },
      { key: "porte", label: "PORTE" },
      { key: "sexo", label: "SEXO" },
      { key: "idade", label: "IDADE" },
      { key: "status", label: "STATUS" },
      { key: "data_cadastro", label: "DATA CADASTRO" },
      { key: "updatedAt", label: "ÚLTIMA ATUALIZAÇÃO" },
    ],
    []
  );
  const animaisFiltrados = useMemo(() => {
    if (!busca) return animais;

    const termo = busca.toLowerCase();
    return animais.filter((animal) =>
      colunas.some((col) =>
        String(animal[col.key] || "")
          .toLowerCase()
          .includes(termo)
      )
    );
  }, [animais, busca, colunas]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    alert("Sessão encerrada!");
    navigate("/login");
  };

  const handleNovoAnimal = () => {
    navigate("/animal/novo");
  };

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
              <Nav.Link as={Link} to="/usuario">
                <b>USUÁRIOS</b>
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
        <h1 className="mb-4 text-center">
          <b>LISTA DE ANIMAIS</b>
        </h1>
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <Form.Group controlId="formBusca">
              <FormControl
                type="text"
                placeholder="BUSCAR POR NOME, ESPÉCIE OU RAÇA..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="success" as={Link} to="/animal/novo">
              <b>CADASTRAR</b>
            </Button>
          </Col>
        </Row>
        <div className="table-responsive">
          {animaisFiltrados.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  {colunas.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>AÇÕES</th>{" "}
                </tr>
              </thead>
              <tbody>
                {animaisFiltrados.map((animal) => (
                  <tr key={animal.id}>
                    {colunas.map((col) => (
                      <td key={col.key}>
                        {col.key === "disponivel" ? (
                          <span
                            className={`badge bg-${
                              animal.disponivel ? "success" : "warning"
                            }`}
                          ></span>
                        ) : (
                          animal[col.key]
                        )}
                      </td>
                    ))}
                    <td className="text-center">
                      <Button
                        variant="warning"
                        size="sm"
                        as={Link}
                        to={`/animal/editar/${animal.id}`}
                        className="me-2"
                      >
                        <b>DETALHES</b>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => excluirAnimal(animal.id)}
                      >
                        <b>EXCLUIR</b>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="alert alert-info text-center">
              {busca ? "NENHUM ANIMAL ENCONTRADO" : "NENHUM ANIMAL CADASTRADO"}
            </p>
          )}
        </div>
      </Container>
    </>
  );
};

export default Animal;
