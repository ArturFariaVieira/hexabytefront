import { useAuth } from "context/AuthProvider/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "services/api";
import useWindowDimensions from "shared/components/getWindowDimensions";
import styled from "styled-components";
import Produto from "./components/Produto";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [cleanup, setCleanup] = useState([false]);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user.admin) {
      return navigate("/");
    }

    Api.get("/products/admin").then((r) => {
      setProdutos(r.data);
      console.log(r);
    });
  }, [cleanup]);

  async function remove(id) {
    const produtosRemovido = produtos.filter((p) => p._id != id);
    setProdutos(produtosRemovido);
    await Api.delete(`/${id}`);
    setCleanup(true);
  }

  return (
    <Container>
      <BotaoAddProduct
        w={width > 900 && "300px"}
        onClick={() => {
          navigate("/addProduct");
        }}
      >
        Adicionar produto
      </BotaoAddProduct>
      <ProdutoContainer>
        {produtos.map((p) => (
          <Produto key={p._id} produto={p} remove={remove} />
        ))}
      </ProdutoContainer>
    </Container>
  );
}

const ProdutoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Container = styled.div`
  padding: 20px;
`;

const BotaoAddProduct = styled.button`
  margin-top: 12px;
  width: 100%;
  width: ${(props) => (props.w ? props.w : "")};
  outline: none;
  border: none;
  background-color: rgb(0 126 255);
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Raleway";
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin: 0 auto;
  margin-bottom: 50px;
`;
