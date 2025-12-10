import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
  Spinner, // Importando o Spinner
} from "react-bootstrap";
// Note: O import do bootstrap.min.css foi removido pois está implícito no EditarUsuario.jsx.

const EditarHistoricoAdocao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historicoAdocao, setHistoricoAdocao] = useState({
    id_animal: "",
    id_usuario: "",
    animal_nome: "",
    adotante_nome: "",
    data_adocao: "",
    observacao: "",
  });

  const [animais, setAnimais] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  // Função para buscar dados de seleção (animais e usuários)
  const fetchSelectData = async () => {
    try {
      const animaisRes = await api.get("/animal");
      const animaisData = animaisRes.data?.mensagem || [];
      setAnimais(
        animaisData.map((a) => ({ id: a.id, nome: a.nome, especie: a.especie }))
      );
      const usuariosRes = await api.get("/usuario");
      const usuariosData = usuariosRes.data?.mensagem || [];
      setUsuarios(usuariosData.map((u) => ({ id: u.id, nome: u.nome })));
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR DADOS DE SELEÇÃO (ANIMAIS/ADOTANTES - RECONECTAR)",
        error.response || error
      );
      setStatus((s) => ({
        ...s,
        error: "ERRO AO CARREGAR LISTAS DE ANIMAIS/ADOTANTES",
      }));
    }
  };

  // Função para buscar o histórico específico
  const fetchHistorico = async () => {
    setLoadingInitial(true);
    setStatus((s) => ({ ...s, error: null, success: null }));
    try {
      const response = await api.get(`/historico_adocao/${id}`);
      const data = response.data?.historico;
      if (!data) throw new Error("HISTÓRICO NÃO LOCALIZADO");

      // Formatação da data para o formato DD/MM/AAAA (mantendo a lógica original)
      const dataAdocaoObj = data.data_adocao
        ? new Date(data.data_adocao)
        : null;
      const dataFormatada =
        dataAdocaoObj && !isNaN(dataAdocaoObj)
          ? dataAdocaoObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) // Formato DD/MM/AAAA
          : "";

      setHistoricoAdocao({
        id_animal: data.id_animal || "",
        id_usuario: data.id_usuario || "",
        animal_nome: data.animal_adotado?.nome || "ANIMAL DESCONHECIDO",
        adotante_nome: data.adotante?.nome || "ADOTANTE DESCONHECIDO",
        data_adocao: dataFormatada,
        observacao: data.observacao || "",
      });
    } catch (error) {
      console.error("ERRO AO CARREGAR HISTÓRICO:", error.response || error);
      setStatus((s) => ({
        ...s,
        error: "ERRO AO CARREGAR OS DADOS DE HISTÓRICO. (RECONECTAR)",
      }));
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    // Chamada inicial para carregar dados do histórico e listas de seleção
    if (id) {
      fetchHistorico();
      fetchSelectData();
    } else {
      setLoadingInitial(false);
    }
  }, [id]);

  // Handler de mudança para os campos de input/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHistoricoAdocao({ ...historicoAdocao, [name]: value });
  };

  // Handler de submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Montar o payload
    const payload = {
      id_animal: historicoAdocao.id_animal,
      id_usuario: historicoAdocao.id_usuario,
      data_adocao: historicoAdocao.data_adocao,
      observacao: historicoAdocao.observacao,
    };

    // Validação simples de campos obrigatórios
    if (!payload.id_animal || !payload.id_usuario || !payload.data_adocao) {
      setStatus({
        loading: false,
        error:
          "PREENCHA TODOS OS CAMPOS OBRIGATÓRIOS (ADOTANTE, ANIMAL E DATA)",
        success: null,
      });
      return;
    }

    try {
      const response = await api.put(`/historico_adocao/${id}`, payload);
      setStatus({
        loading: false,
        error: null,
        success: response.data.mensagem || "HISTÓRICO ATUALIZADO!",
      });
      console.log("HISTÓRICO ATUALIZADO:", response.data);

      setTimeout(() => navigate("/historico_adocao"), 1500);
    } catch (error) {
      console.error("ERRO AO ATUALIZAR HISTÓRICO:", error.response || error);
      const mensagemErro =
        error.response?.data?.mensagem || "ERRO AO ATUALIZAR (RECONECTAR).";
      setStatus({
        loading: false,
        error: `ERRO NA ATUALIZAÇÃO: ${mensagemErro}`,
        success: null,
      });
    }
  };

  // --- Renderização de Carregamento Inicial ---
  if (loadingInitial) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">CARREGANDO...</p>
      </Container>
    );
  }

  // --- Renderização de Erro Inicial ---
  if (status.error && !status.loading && !loadingInitial) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {status.error}
          <div className="mt-2">
            <Button as={Link} to="/historico_adocao" variant="danger">
              VOLTAR
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // --- Renderização Principal ---
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={12} lg={12}>
          <Card className="shadow-lg">
            <Card.Header className="bg-warning text-dark">
              <h2 className="mb-0">
                <b>
                  <center>DETALHES HISTÓRICO ADOÇÃO (ID: {id})</center>
                </b>
              </h2>
            </Card.Header>
            <Card.Body>
              {/* Exibição de Alertas de Status */}
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && (
                <Alert variant="success">{status.success}</Alert>
              )}
              <h5 className="mb-4">
                ADOÇÃO DE {historicoAdocao.animal_nome} POR{" "}
                {historicoAdocao.adotante_nome}
              </h5>
              <hr />

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formAnimal">
                      <Form.Label>
                        <b>ANIMAL</b>
                      </Form.Label>
                      <Form.Select
                        name="id_animal"
                        value={historicoAdocao.id_animal}
                        onChange={handleChange}
                        required
                        disabled={animais.length === 0}
                      >
                        <option value="">
                          {animais.length > 0
                            ? "Selecione um Animal"
                            : "Carregando Animais..."}
                        </option>
                        {animais.map((animal) => (
                          <option key={animal.id} value={animal.id}>
                            {animal.nome || `Animal ID: ${animal.id}`}
                          </option>
                        ))}
                      </Form.Select>
                      {animais.length === 0 && (
                        <Form.Text className="text-danger">
                          Não há animais disponíveis.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formAdotante">
                      <Form.Label>
                        <b>ADOTANTE</b>
                      </Form.Label>
                      <Form.Select
                        name="id_usuario"
                        value={historicoAdocao.id_usuario}
                        onChange={handleChange}
                        required
                        disabled={usuarios.length === 0}
                      >
                        <option value="">
                          {usuarios.length > 0
                            ? "SELECIONE UM ADOTANTE"
                            : "CARREGANDO ADOTANTES..."}
                        </option>
                        {usuarios.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nome || `USUÁRIO ID: ${user.id}`}
                          </option>
                        ))}
                      </Form.Select>
                      {usuarios.length === 0 && (
                        <Form.Text className="text-danger">
                          NÃO HÁ ADOTANTES DISPONÍVEIS
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="formDataAdocao">
                  <Form.Label>
                    <b>DATA ADOÇÃO</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DD/MM/AAAA"
                    name="data_adocao"
                    value={historicoAdocao.data_adocao}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Campo Observação */}
                <Form.Group className="mb-4" controlId="formObservacao">
                  <Form.Label>
                    <b>OBSERVAÇÃO</b>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="DETALHES SOBRE A ADOÇÃO..."
                    name="observacao"
                    value={historicoAdocao.observacao}
                    onChange={handleChange}
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* Botões de Ação */}
                <div className="d-grid gap-2">
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={status.loading}
                  >
                    <b>{status.loading ? "ATUALIZANDO..." : "SALVAR"}</b>
                  </Button>
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/historico_adocao"
                    disabled={status.loading}
                  >
                    <b>VOLTAR</b>
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditarHistoricoAdocao;
