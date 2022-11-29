import { useAuth } from "context/AuthProvider/useAuth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Api } from "services/api";
import Button from "shared/components/Button";
import H1 from "shared/components/H1";
import Input from "shared/components/Input";
import styled from "styled-components";
import swal from "sweetalert";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user.admin) {
      return navigate("/");
    }

    Api.get(`/${productId}`).then((r) => {
      setTitulo(r.data.titulo);
      setDescricao(r.data.descricao);
      setValor(r.data.valor);
      setCategoria(r.data.categoria);
      setImagem(r.data.imagem);
    });
  }, []);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const body = {
      titulo,
      descricao,
      valor,
      categoria,
      imagem,
    };

    Api.put(`/${productId}`, body)
      .then((r) => {
        swal("Boa", "Edição finalizada", "success");
        navigate("/admin");
      })
      .catch((err) => {
        console.log(err);
        swal("Opps", "Algo deu errado", "error");
      });
  }

  return (
    <>
      <H1>Edição de produto</H1>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Input
          required
          placeholder="Titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <Input
          required
          placeholder="Descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <Input
          required
          placeholder="Imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
        <Input
          placeholder="Valor"
          required
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
        />
        <Select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="Armazenamento">Armazenamento</option>
          <option value="Cooler">Cooler</option>
          <option value="Fonte">Fonte</option>
          <option value="Memoria RAM">Memoria RAM</option>
          <option value="Placa de Vídeo">Placa de Vídeo</option>
          <option value="Processador">Processador</option>
        </Select>
        <Button>Atualizar</Button>
      </Form>
    </>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 100%;
  margin-top: 34px;
`;

const Select = styled.select`
  background: rgb(42 42 42);
  border-radius: 5px;
  outline: none;
  height: 58px;
  padding-left: 15px;
  width: ${(props) => (props.w ? props.w : "100%")};

  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  font-family: "Raleway";
  color: rgb(119 119 119);
  border: 1px solid #6e6e6e;

  ::placeholder {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    font-family: "Raleway";
    color: rgb(119 119 119);
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: rgb(119 119 119);
    -webkit-box-shadow: 0 0 0px 1000px rgb(42 42 42) inset;
    font-size: 23px;
  }
`;
