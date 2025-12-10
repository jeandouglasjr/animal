import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import api from "../services/api";

const NovoHistoricoAdocao = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_animal: "",
    id_usuario: "",
    data_adocao: new Date().toISOString().substring(0, 10),
    observacao: "",
  });
  const [animais, setAnimais] = useState([]);
  const [adotantes, setAdotantes] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const buscarDadosIniciais = async () => {
    try {
      const animaisResponse = await api.get("/animal");
      const animaisData = animaisResponse.data?.mensagem || [];
      setAnimais(
        animaisData
          .filter((a) => a.disponivel !== false)
          .map((a) => ({ id: a.id, nome: a.nome, especie: a.especie }))
      );
      const usuariosResponse = await api.get("/usuario");
      const usuariosData = usuariosResponse.data?.mensagem || [];
      setAdotantes(usuariosData.map((u) => ({ id: u.id, nome: u.nome })));
    } catch (err) {
      console.error("ERRO AO BUSCAR DADOS DO ANIMAL/ADOTANTE", err);
      setStatus((prev) => ({
        ...prev,
        error: "ERRO AO BUSCAR DADOS DO ANIMAL/ADOTANTE",
      }));
    }
  };
  useEffect(() => {
    buscarDadosIniciais();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    if (!formData.id_animal || !formData.id_usuario) {
      setStatus({
        loading: false,
        error: "SELECIONE O ANIMAL E O ADOTANTE",
        success: null,
      });
      return;
    }
    try {
      const payload = {
        id_animal: parseInt(formData.id_animal),
        id_usuario: parseInt(formData.id_usuario),
        data_adocao: formData.data_adocao,
        observacao: formData.observacao,
      };
      const response = await api.post("/historico_adocao", payload);
      setStatus({
        loading: false,
        error: null,
        success: "HISTÓRICO DE ADOÇÃO CADASTRADO!",
      });
      console.log("HISTÓRICO CRIADO:", response.data);
      setTimeout(() => {
        navigate("/historico_adocao");
      }, 1500);
    } catch (error) {
      console.error(
        "ERRO AO CADASTRAR HISTÓRICO DE ADOÇÃO",
        error.response || error
      );
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "ERRO AO CADASTRAR HISTÓRICO DE ADOÇÃO (RECONECTAR)",
        success: null,
      });
    }
  };
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={12} lg={12}>
          <Card className="shadow-lg">
            <Card.Header className="bg-info text-white">
              <h2 className="mb-0">
                <b>
                  <center>CADASTRAR ADOÇÃO</center>
                </b>
              </h2>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && (
                <Alert variant="success">{status.success}</Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row className="mb-12">
                  <Form.Group as={Col} controlId="formAnimal">
                    <Form.Label>
                      <b>ANIMAL</b>
                    </Form.Label>
                    <Form.Select
                      name="id_animal"
                      value={formData.id_animal}
                      onChange={handleChange}
                      required
                      disabled={animais.length === 0}
                    >
                      <option value="">SELECIONE...</option>
                      {animais.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.nome} ({animal.especie})
                        </option>
                      ))}
                    </Form.Select>
                    {animais.length === 0 && (
                      <Form.Text className="text-danger">
                        <b>NENHUM ANIMAL DISPONÍVEL NO CADASTRO</b>
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} controlId="formAdotante">
                    <Form.Label>
                      <b>ADOTANTE</b>
                    </Form.Label>
                    <Form.Select
                      name="id_usuario"
                      value={formData.id_usuario}
                      onChange={handleChange}
                      required
                      disabled={adotantes.length === 0}
                    >
                      <option value="">
                        <b>SELECIONE...</b>
                      </option>
                      {adotantes.map((adotante) => (
                        <option key={adotante.id} value={adotante.id}>
                          {adotante.nome}
                        </option>
                      ))}
                    </Form.Select>
                    {adotantes.length === 0 && (
                      <Form.Text className="text-danger">
                        <b>NENHUM ADOTANTE DISPONÍVEL NO CADASTRO</b>
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formDataAdocao">
                    <Form.Label>
                      <b>DATA ADOÇÃO</b>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="data_adocao"
                      value={formData.data_adocao}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Form.Group controlId="formObservacao" className="mb-4">
                  <Form.Label>
                    <b>OBSERVAÇÃO</b>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleChange}
                    placeholder="REGISTRAR INFORMAÇÕES RELEVANTES AO ANIMAL, EXEMPLO: VACINADO, CASTRADO, EM TRATAMENTO, ALERGIAS, ETC"
                  />
                </Form.Group>
                <hr className="my-12" />
                <div className="d-grid gap-2">
                  <Button
                    variant="info"
                    type="submit"
                    disabled={
                      status.loading ||
                      animais.length === 0 ||
                      adotantes.length === 0
                    }
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

export default NovoHistoricoAdocao;
