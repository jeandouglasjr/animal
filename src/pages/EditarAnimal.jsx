import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import api from "../services/api";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }
  if (/\d{4}-\d{2}-\d{2}/.test(dateString)) {
    return dateString;
  }
  const parts = dateString.split(/[-\/]/);
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return "";
};

const EditarAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [animal, setAnimal] = useState({
    nome: "",
    especie: "",
    raca: "",
    porte: "",
    sexo: "",
    nascimento: "",
    saude: "",
    status: "",
    data_resgate: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoadingInitial(true);
        const response = await api.get(`/animal/${id}`);
        const data = response.data?.animal;
        setAnimal({
          nome: data.nome || "",
          especie: data.especie || "",
          raca: data.raca || "",
          sexo: data.sexo || "",
          nascimento: formatDateForInput(data.nascimento),
          porte: data.porte || "",
          saude: data.saude || "",
          status: data.status || "",
          data_resgate: formatDateForInput(data.data_resgate),
        });
        setStatus({ loading: false, error: null, success: null });
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR DADOS DO ANIMAL",
          error.response || error
        );
        setStatus({
          loading: false,
          error: "ERRO AO CARREGAR DADOS DO ANIMAL (RECONECTAR)",
          success: null,
        });
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const handleAnimalChange = (e) => {
    setAnimal({ ...animal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const payload = {
      ...animal,
    };
    try {
      const response = await api.put(`/animal/${id}`, payload);
      setStatus({
        loading: false,
        error: null,
        success: response.data.mensagem || "ANIMAL ATUALIZADO!",
      });
      console.log("ANIMAL ATUALIZADO:", response.data);
      setTimeout(() => {
        navigate("/animal");
      }, 1500);
    } catch (error) {
      console.error("ERRO AO ATUALIZAR ANIMAL", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "ERRO AO ATUALIZAR ANIMAL (RECONECTAR)",
        success: null,
      });
    }
  };

  if (loadingInitial) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="info">
          <span className="visually-hidden">
            <b>CARREGANDO...</b>
          </span>
        </Spinner>
        <p className="mt-2">
          <b>CARREGANDO DADOS DO ANIMAL...</b>
        </p>
      </Container>
    );
  }

  if (status.error && !status.loading && !loadingInitial) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {status.error}
          <div className="mt-2">
            <Button as={Link} to="/animal" variant="danger">
              <b>VOLTAR</b>
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={12} lg={12}>
          <Card className="shadow-lg">
            <Card.Header className="bg-info text-white">
              <h2 className="mb-0">
                DETALHES DO {animal.nome ? animal.nome.toUpperCase() : "ANIMAL"}{" "}
              </h2>
            </Card.Header>
            <Card.Body>
              {status.error && <Alert variant="danger">{status.error}</Alert>}
              {status.success && (
                <Alert variant="success">{status.success}</Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formNome">
                    <Form.Label>
                      <b>NOME</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="NOME DO ANIMAL"
                      name="nome"
                      value={animal.nome}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formEspecie">
                    <Form.Label>
                      <b>ESPÉCIE</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="EX: CACHORRO, GATO..."
                      name="especie"
                      value={animal.especie}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formRaca">
                    <Form.Label>
                      <b>RAÇA</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="EX: LABRADOR, SIAMÊS..."
                      name="raca"
                      value={animal.raca}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formPorte">
                    <Form.Label>
                      <b>PORTE</b>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="porte"
                      value={animal.porte}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">{animal.porte}</option>
                      <option value="PEQUENO">PEQUENO</option>
                      <option value="MÉDIO">MÉDIO</option>
                      <option value="GRANDE">GRANDE</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
                <hr className="my-4" />
                <Row className="mb-4">
                  <Form.Group as={Col} md={6} controlId="formNascimento">
                    <Form.Label>
                      <b>NASCIMENTO</b>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="nascimento"
                      value={animal.nascimento}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="formResgate">
                    <Form.Label>
                      <b>DATA RESGATE</b>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="data_resgate"
                      value={animal.data_resgate}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formSexo">
                    <Form.Label>
                      <b>SEXO</b>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="sexo"
                      value={animal.sexo}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">{animal.sexo}</option>
                      <option value="MACHO">MACHO</option>
                      <option value="FÊMEA">FÊMEA</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formStatus">
                    <Form.Label>
                      <b>STATUS</b>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      value={animal.status}
                      onChange={handleAnimalChange}
                      required
                    >
                      <option value="">{animal.status}</option>
                      <option value="DISPONÍVEL">DISPONÍVEL</option>
                      <option value="ADOTADO">ADOTADO</option>
                      <option value="TRATAMENTO">TRATAMENTO</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formSaude">
                    <Form.Label>
                      <b>SAÚDE / HISTÓRICO VETERINÁRIO</b>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="INFORMAÇÕES COMO VACINAS, CASTRAÇÃO, PROBLEMAS DE SAÚDE..."
                      name="saude"
                      value={animal.saude}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <hr className="my-4" />
                <div className="d-grid gap-2">
                  <Button
                    variant="info"
                    type="submit"
                    disabled={status.loading}
                    className="text-white"
                  >
                    <b>{status.loading ? "ATUALIZANDO..." : "SALVAR"}</b>
                  </Button>
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/animal"
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

export default EditarAnimal;
