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

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    fone: "",
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

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoadingInitial(true);
        const response = await api.get(`/usuario/${id}`);
        const data = response.data?.usuario;

        setUsuario({
          nome: data.nome || "",
          email: data.email || "",
          cpf: data.cpf || "",
          fone: data.fone || "",
          senha: "",
        });

        let dataend = data?.enderecos;
        if (dataend) {
          if (!Array.isArray(dataend)) {
            dataend = [dataend];
          }
          setEnderecos(
            dataend.map((addr) => ({
              logradouro: addr.logradouro || "",
              numero: addr.numero || "",
              complemento: addr.complemento || "",
              municipio: addr.municipio || "",
              uf: addr.uf || "",
              cep: addr.cep || "",
              bairro: addr.bairro || "",
            }))
          );
        } else {
          setEnderecos([
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
        }
      } catch (error) {
        console.error("ERRO AO CARREGAR USUÁRIO", error.response || error);
        setStatus({
          loading: false,
          error: "ERRO AO CARREGAR USUÁRIO (RECONECTAR)",
          success: null,
        });
      } finally {
        setLoadingInitial(false);
      }
    };
    if (id) {
      fetchUsuario();
    } else {
      setLoadingInitial(false);
    }
  }, [id]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    const payload = {
      ...usuario,
      enderecos: enderecos.filter(
        (addr) => addr.logradouro && addr.municipio && addr.uf && addr.bairro
      ),
    };
    if (payload.enderecos.length === 0) {
      setStatus({
        loading: false,
        error: "PELO MENOS UM ENDEREÇO COMPLETO (CAMPOS OBRIGATÓRIOS)",
        success: null,
      });
      return;
    }
    if (usuario.senha === "") {
      delete payload.senha;
    }
    try {
      const response = await api.put(`/usuario/${id}`, payload);
      setStatus({
        loading: false,
        error: null,
        success: "USUÁRIO ATUALIZADO!",
      });
      console.log("USUÁRIO ATUALIZADO:", response.data);
      setTimeout(() => {
        navigate("/usuario");
      }, 1500);
    } catch (error) {
      console.error("ERRO AO EDITAR USUÁRIO", error.response || error);
      setStatus({
        loading: false,
        error:
          error.response?.data?.mensagem ||
          "ERRO AO ATUALIZAR USUÁRIO (RECONECTAR)",
        success: null,
      });
    }
  };

  if (loadingInitial) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando dados do usuário...</p>
      </Container>
    );
  }
  if (status.error && !status.loading && !loadingInitial) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {status.error}
          <div className="mt-2">
            <Button as={Link} to="/usuario" variant="danger">
              Voltar para a Lista
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
            <Card.Header className="bg-warning text-dark">
              <h2 className="mb-0">
                <b>
                  <center>DETALHES DO {usuario.nome || "ID " + id}</center>
                </b>
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
                      placeholder="Nome Completo"
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
                      placeholder="Fone (48) 90000-0000"
                      name="fone"
                      value={usuario.fone}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email email@exemplo.com"
                      name="email"
                      value={usuario.email}
                      onChange={handleUsuarioChange}
                      required
                    />
                  </Form.Group>
                </Row>

                <hr className="my-4" />

                {enderecos.map((enderecoItem, index) => (
                  <Card key={index} className="mb-3 p-3 bg-light">
                    <Row>
                      <Col md={9} className="mb-2">
                        <Form.Group controlId={`endLogradouro${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="Rua, Avenida, etc."
                            name="logradouro"
                            value={enderecoItem.logradouro}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Form.Group controlId={`endNumero${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="Nº"
                            name="numero"
                            value={enderecoItem.numero}
                            onChange={(e) => handleEnderecoChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col md={7} className="mb-2">
                        <Form.Group controlId={`endComplemento${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="Complemento Casa, Ap, Bloco..."
                            name="complemento"
                            value={enderecoItem.complemento}
                            onChange={(e) => handleEnderecoChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={5} className="mb-2">
                        <Form.Group controlId={`endBairro${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="Bairro"
                            name="bairro"
                            value={enderecoItem.bairro}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col md={4} className="mb-2">
                        <Form.Group controlId={`endCEP${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="CEP 88130-300"
                            name="cep"
                            value={enderecoItem.cep}
                            onChange={(e) => handleEnderecoChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-2">
                        <Form.Group controlId={`endMunicipio${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="Município"
                            name="municipio"
                            value={enderecoItem.municipio}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="mb-2">
                        <Form.Group controlId={`endUF${index}`}>
                          <Form.Control
                            type="text"
                            placeholder="UF"
                            name="uf"
                            maxLength={2}
                            value={enderecoItem.uf}
                            onChange={(e) => handleEnderecoChange(index, e)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col className="d-flex justify-content-end">
                        {enderecos.length > 1 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => removeEndereco(index)}
                            size="sm"
                          >
                            Remover Endereço
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}

                <hr className="my-4" />

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

export default EditarUsuario;
