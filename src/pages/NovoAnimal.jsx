import { useState } from "react";
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

const NovoAnimal = () => {
  const navigate = useNavigate();
  const [animal, setAnimal] = useState({
    nome: "",
    especie: "",
    raca: "",
    sexo: "",
    nascimento: "",
    porte: "",
    saude: "",
    status: "",
    data_resgate: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
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
      const response = await api.post("/animal", payload);
      setStatus({
        loading: false,
        error: null,
        success: response.data.mensagem || "Animal cadastrado com sucesso!",
      });
      console.log("Animal Cadastrado:", response.data);
      setTimeout(() => {
        navigate("/animal");
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar animal", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "Erro ao cadastrar. Verifique a conexão com a API e os dados.",
        success: null,
      });
    }
  };

  return (
    <Container className="my-5">
      {" "}
      <Row className="justify-content-md-center">
        {" "}
        <Col md={12} lg={12}>
          {" "}
          <Card className="shadow-lg">
            {" "}
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">
                <b>
                  <center>CADASTRAR ANIMAL</center>
                </b>
              </h2>{" "}
            </Card.Header>{" "}
            <Card.Body>
              {" "}
              {status.error && (
                <Alert variant="danger">{status.error}</Alert>
              )}{" "}
              {status.success && (
                <Alert variant="success">{status.success}</Alert>
              )}{" "}
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  {" "}
                  <Form.Group as={Col} controlId="formNome">
                    <Form.Label>
                      <b>NOME</b>
                    </Form.Label>{" "}
                    <Form.Control
                      type="text"
                      placeholder="NOME DO ANIMAL"
                      name="nome"
                      value={animal.nome}
                      onChange={handleAnimalChange}
                      required
                    />{" "}
                  </Form.Group>{" "}
                  <Form.Group as={Col} controlId="formEspecie">
                    <Form.Label>
                      <b>ESPÉCIE</b>
                    </Form.Label>{" "}
                    <Form.Control
                      type="text"
                      placeholder="EX: CACHORRO, GATO..."
                      name="especie"
                      value={animal.especie}
                      onChange={handleAnimalChange}
                      required
                    />{" "}
                  </Form.Group>{" "}
                  <Form.Group as={Col} controlId="formRaca">
                    <Form.Label>
                      <b>RAÇA</b>
                    </Form.Label>{" "}
                    <Form.Control
                      type="text"
                      placeholder="EX: LABRADOR, SIAMÊS..."
                      name="raca"
                      value={animal.raca}
                      onChange={handleAnimalChange}
                      required
                    />{" "}
                  </Form.Group>{" "}
                </Row>
                <Row className="mb-4">
                  {" "}
                  <Form.Group as={Col} controlId="formSexo">
                    <Form.Label>
                      <b>SEXO</b>
                    </Form.Label>{" "}
                    <Form.Control
                      as="select"
                      name="sexo"
                      value={animal.sexo}
                      onChange={handleAnimalChange}
                      required
                    >
                      {" "}
                      <option value="">SELECIONE</option>
                      <option value="MACHO">MACHO</option>
                      <option value="FÊMEA">FÊMEA</option>{" "}
                    </Form.Control>{" "}
                  </Form.Group>{" "}
                  <Form.Group as={Col} controlId="formPorte">
                    <Form.Label>
                      <b>PORTE</b>
                    </Form.Label>{" "}
                    <Form.Control
                      as="select"
                      name="porte"
                      value={animal.porte}
                      onChange={handleAnimalChange}
                      required
                    >
                      {" "}
                      <option value="">SELECIONE</option>
                      <option value="PEQUENO">PEQUENO</option>
                      <option value="MÉDIO">MÉDIO</option>
                      <option value="GRANDE">GRANDE</option>{" "}
                    </Form.Control>{" "}
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
                      <option value="">SELECIONE</option>
                      <option value="DISPONÍVEL">DISPONÍVEL</option>
                      <option value="RESGATADO">RESGATADO</option>
                      <option value="TRATAMENTO">TRATAMENTO</option>
                    </Form.Control>
                  </Form.Group>{" "}
                </Row>
                <hr className="my-4" />
                <Row className="mb-4">
                  {" "}
                  <Form.Group as={Col} md={6} controlId="formNascimento">
                    <Form.Label>
                      <b>NASCIMENTO</b>
                    </Form.Label>{" "}
                    <Form.Control
                      type="date"
                      name="nascimento"
                      value={animal.nascimento}
                      onChange={handleAnimalChange}
                    />{" "}
                  </Form.Group>{" "}
                  <Form.Group as={Col} md={6} controlId="formDataResgate">
                    <Form.Label>
                      <b>DATA RESGATE</b>
                    </Form.Label>{" "}
                    <Form.Control
                      type="date"
                      name="data_resgate"
                      value={animal.data_resgate}
                      onChange={handleAnimalChange}
                      required
                    />{" "}
                  </Form.Group>{" "}
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formSaude">
                    <Form.Label>
                      <b>SAÚDE</b>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="INFORMAÇÕES COMO: VACINADO, CASTRADO, ALERGIAS, TRATAMENTOS EM ANDAMENTO..."
                      name="saude"
                      value={animal.saude}
                      onChange={handleAnimalChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <hr className="my-4" />{" "}
                <div className="d-grid gap-2">
                  {" "}
                  <Button
                    variant="success"
                    type="submit"
                    disabled={status.loading}
                  >
                    {" "}
                    <b>{status.loading ? "CADASTRANDO..." : "CADASTRAR"} </b>
                  </Button>{" "}
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/animal"
                    disabled={status.loading}
                  >
                    <b>VOLTAR </b>
                  </Button>{" "}
                </div>{" "}
              </Form>{" "}
            </Card.Body>{" "}
          </Card>{" "}
        </Col>{" "}
      </Row>{" "}
    </Container>
  );
};

export default NovoAnimal;
