import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Api } from "services/api";
import Button from "shared/components/Button";
import H1 from "shared/components/H1";
import Input from "shared/components/Input";
import Loader from "shared/components/Loader";
import styled from "styled-components";
import swal from "sweetalert";

export default function Checkout() {
  const navigate = useNavigate();
  const containerContext = useOutletContext();

  const [produtos, setProdutos] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState("boleto");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");

  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    Api.get("cart/product").then((d) => {
      if (!(d.data instanceof Array)) navigate("/login");
      setProdutos(d.data);
    });
  }, []);

  function getTotal() {
    let total = 0;
    produtos.forEach((p) => (total += Number(p.valor)));
    return total;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const body = {
      paymentForm,
      numero,
      cep,
    };

    Api.post("/checkout", body)
      .then((r) => {
        swal("Boa", "Compra finalizada", "success");
        containerContext.setItensCart(0);
        navigate("/");
      })
      .catch((err) => {
        swal("Opps", "Algo deu errado", "error");
      });
  }

  function consultCep(cep) {
    axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => {
        setRua(r.data.logradouro || "");
        setCidade(r.data.localidade || "");
        setEstado(r.data.uf || "");
        console.log(r, "ok");
      })
      .catch((err) => {
        swal("Opps", "CEP incorreto", "error");
      });
  }

  return (
    <>
      <Loader loading={loading} />
      {produtos === null ? (
        <Loader />
      ) : (
        produtos.length > 0 &&
        produtos instanceof Array && (
          <>
            <ContainerTotal>
              <H1>
                Total <ValorTotal>R$ {getTotal().toFixed(2)}</ValorTotal>
              </H1>
            </ContainerTotal>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Input
                placeholder="Cep"
                onBlur={(e) => consultCep(e.target.value)}
                onChange={(e) => setCep(e.target.value)}
                value={cep}
              />
              <Input placeholder="Rua" value={rua} disabled />
              <Input placeholder="Cidade" value={cidade} disabled />
              <Input placeholder="Estado" value={estado} disabled />
              <Input
                placeholder="Numero"
                required
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <Select
                value={paymentForm}
                onChange={(e) => setPaymentForm(e.target.value)}
              >
                <option value="pix">PIX</option>
                <option value="boleto">Boleto</option>
                <option value="cartao">Cartão</option>
              </Select>
              <Button>Confirmar compra</Button>
            </Form>
          </>
        )
      )}
    </>
  );
}

const ContainerTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ValorTotal = styled.span`
  color: green;
  font-family: Arial;
`;

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
