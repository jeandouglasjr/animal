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

const NovoUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });
  const [enderecos, setEnderecos] = useState([
    {
      logradouro: "",
      numero: "",
      complemento: "",
      municipio: "",
      uf: "",
      cep: "",
      bairro: "",
    },
  ]);
  const [contatos, setContatos] = useState([{ tipo: "Telefone", valor: "" }]);
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const handleUsuarioChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleEnderecoChange = (index, e) => {
    const novosEnderecos = enderecos.map((endereco, i) => {
      if (i === index) {
        return { ...endereco, [e.target.name]: e.target.value };
      }
      return endereco;
    });
    setEnderecos(novosEnderecos);
  };

  const addEndereco = () => {
    setEnderecos([
      ...enderecos,
      {
        logradouro: "",
        numero: "",
        complemento: "",
        municipio: "",
        uf: "",
        cep: "",
        bairro: "",
      },
    ]);
  };

  const removeEndereco = (index) => {
    const novosEnderecos = enderecos.filter((_, i) => i !== index);
    setEnderecos(novosEnderecos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const payload = {
      ...usuario,
      enderecos: enderecos.filter(
        (addr) => addr.logradouro && addr.municipio && addr.uf && addr.bairro
      ),
      contatos: contatos.filter((cont) => cont.valor),
    };

    if (payload.enderecos.length === 0) {
      setStatus({
        loading: false,
        error:
          "Pelo menos um endereço completo (Logradouro, Bairro, Município, UF) é obrigatório.",
        success: null,
      });
      return;
    }

    try {
      const response = await api.post("/usuario", payload);
      setStatus({
        loading: false,
        error: null,
        success: "USUÁRIO CADASTRADO",
      });
      console.log("USUÁRIO CRIADO:", response.data);

      setTimeout(() => {
        navigate("/usuario");
      }, 1500);
    } catch (error) {
      console.error("ERRO AO CADASTRAR USUÁRIO", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "ERRO AO CADASTRAR USUÁRIO (RECONECTAR)",
        success: null,
      });
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">
                <center>CADASTRAR USUÁRIO</center>
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
                    <Form.Control
                      type="text"
                      placeholder="NOME COMPLETO"
                      name="nome"
                      value={usuario.nome}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formCPF">
                    <Form.Control
                      type="text"
                      placeholder="CPF 000.000.000-00"
                      name="cpf"
                      value={usuario.cpf}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} controlId="formFone">
                    <Form.Control
                      type="text"
                      placeholder="FONE (48) 99999-9999"
                      name="fone"
                      value={usuario.fone}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="EMAIL EMAIL@EXEMPLO.COM"
                      name="email"
                      value={usuario.email}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formSenha">
                    <Form.Control
                      type="password"
                      placeholder="SUA SENHA ******"
                      name="senha"
                      value={usuario.senha}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                </Row>

                <hr className="my-4" />

                {enderecos.map((endereco, index) => (
                  <Card key={index} className="mb-3 p-3 bg-light">
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId={`endLogradouro${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="RUA, AVENIDA, SERVIDÃO..."
                            name="logradouro"
                            value={endereco.logradouro}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId={`endNumero${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="Nº"
                            name="numero"
                            value={endereco.numero}
                            onChange={(e) => handleEnderecoChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={6}>
                        <Form.Group controlId={`endComplemento${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="COMPLEMENTO..."
                            name="complemento"
                            value={endereco.complemento}
                            onChange={(e) => handleEnderecoChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId={`endBairro${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="BAIRRO"
                            name="bairro"
                            value={endereco.bairro}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={5}>
                        <Form.Group controlId={`endCEP${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="CEP 88130-300"
                            name="cep"
                            value={endereco.cep}
                            onChange={(e) => handleEnderecoChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={5}>
                        <Form.Group controlId={`endMunicipio${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="MUNICÍPIO"
                            name="municipio"
                            value={endereco.municipio}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group controlId={`endUF${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="UF"
                            name="uf"
                            maxLength={2}
                            value={endereco.uf}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <hr className="my-4" />

                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={status.loading}
                  >
                    <b>{status.loading ? "CADASTRANDO..." : "CADASTRAR"}</b>
                  </Button>
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to="/usuario"
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

export default NovoUsuario;
