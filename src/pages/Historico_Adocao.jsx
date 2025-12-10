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
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const HistoricoAdocao = () => {
  const [historicos, setHistoricos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioLogado] = useState(localStorage.getItem("userName"));
  const navigate = useNavigate();
  const buscarHistoricos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/historico_adocao");
      const dados = response.data?.historicos || [];
      const historicosFormatados = dados.map((hist) => ({
        ...hist,
        id: hist.id || hist.id_animal + "-" + hist.id_usuario,
        data_adocao: hist.data_adocao
          ? new Date(hist.data_adocao).toLocaleDateString("pt-BR")
          : "N/A",
        animal_nome: hist.animal_adotado?.nome || "HISTÓRICO DESCONHECIDO",
        adotante_nome: hist.adotante?.nome || "ADOTANTE DESCONHECIDO",
      }));
      setHistoricos(historicosFormatados);
    } catch (err) {
      console.error("ERRO AO BUSCAR HISTÓRICO DE ADOÇÃO (RECONECTAR)", err);
      setError("ERRO AO BUSCAR HISTÓRICO (RECONECTAR)");
      setHistoricos([]);
    } finally {
      setLoading(false);
    }
  };
  const excluirHistorico = async (id) => {
    try {
      const respostaConfirm = window.confirm(
        "CONFIRMA A EXCLUSÃO DESTE HISTÓRICO DE ADOÇÃO?"
      );
      if (respostaConfirm) {
        await api.delete(`/historico_adocao/${id}`);
        alert(`HISTÓRICO EXCLUÍDO!`);
        buscarHistoricos();
      }
    } catch (err) {
      console.error("ERRO AO EXCLUIR HISTÓRICO:", err);
      const msg =
        err.response?.data?.mensagem ||
        "HISTÓRICO NÃO PÔDE SER EXCLUÍDO (RECONECTAR)";
      alert(msg);
    }
  };

  useEffect(() => {
    buscarHistoricos();
  }, []);

  const colunas = useMemo(
    () => [
      { key: "animal_nome", label: "ANIMAL" },
      { key: "adotante_nome", label: "ADOTANTE" },
      { key: "data_adocao", label: "DATA ADOÇÃO" },
      { key: "observacao", label: "OBSERVAÇÃO" },
    ],
    []
  );

  const historicosFiltrados = useMemo(() => {
    if (!busca) return historicos;

    const termo = busca.toLowerCase();
    return historicos.filter((hist) =>
      colunas.some((col) =>
        String(hist[col.key] || "")
          .toLowerCase()
          .includes(termo)
      )
    );
  }, [historicos, busca, colunas]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    console.log("Usuário deslogado");
    navigate("/login");
  };

  const handleNovoHistorico = () => {
    navigate("/historico_adocao/novo");
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
              <Nav.Link as={Link} to="/animal">
                <b>ANIMAIS</b>
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
          <h1 className="mb-6">
            <b>
              <center>HISTÓRICO ADOÇÕES</center>
            </b>
          </h1>
          <Button variant="success" as={Link} to="/historico_adocao/novo">
            <b>CADASTRAR</b>
          </Button>
        </Row>
        <hr />
        <Row className="mb-4">
          <Col md={12}>
            <Form.Group controlId="formBusca">
              <b>
                <FormControl
                  type="text"
                  placeholder="BUSCAR POR NOME DO ANIMAL OU ADOTANTE"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </b>
            </Form.Group>
          </Col>
        </Row>
        {loading && <Alert variant="info">CARREGANDO HISTÓRICO...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <div className="table-responsive shadow-sm">
            {historicosFiltrados.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead className="table-info">
                  <tr>
                    {colunas.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    <th className="text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {historicosFiltrados.map((hist) => (
                    <tr key={hist.id}>
                      {colunas.map((col) => (
                        <td key={col.key}>{hist[col.key]}</td>
                      ))}
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          as={Link}
                          to={`/historico_adocao/editar/${hist.id}`}
                          className="me-2"
                        >
                          <b>DETALHES</b>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => excluirHistorico(hist.id)}
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
                <b>
                  {busca
                    ? "NENHUM HISTÓRICO ENCONTRADO (BUSQUE OUTROS TERMOS)"
                    : "NENHUM HISTÓRICO REGISTRADO"}
                  .
                </b>
              </p>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default HistoricoAdocao;
