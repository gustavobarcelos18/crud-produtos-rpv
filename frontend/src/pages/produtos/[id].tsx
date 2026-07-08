import { api } from "@/api/axiosInstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const formatarPrecoParaTexto = (valor: number | string) => {
  const numero = typeof valor === "number" ? valor : Number(String(valor).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", "."));

  if (Number.isNaN(numero)) {
    return "";
  }

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatarPrecoDigitado = (valor: string) => {
  const apenasDigitos = valor.replace(/\D/g, "");

  if (!apenasDigitos) {
    return "";
  }

  const numero = Number(apenasDigitos) / 100;

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;
  const produtoId = Array.isArray(id) ? id[0] : id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!produtoId) {
      return;
    }

    const buscarProduto = async () => {
      try {
        const response = await api.get(`/produtos/${produtoId}`);
        const produto = response.data.data;

        setNome(produto.nome || '');
        setDescricao(produto.descricao || '');
        setPreco(formatarPrecoParaTexto(produto.preco));
        setQuantidade(String(produto.quantidade));
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarProduto();
  }, [produtoId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!produtoId) {
      return;
    }

    try {
      await api.put(`/produtos/${produtoId}`, {
        nome,
        descricao,
        preco: Number(String(preco).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".")),
        quantidade: Number(quantidade),
      });

      router.push('/produtos');
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Editar Produto</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          {carregando ? (
            <p className="text-gray-600">Carregando produto...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900">Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Preço</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="R$ 0,00"
                    value={preco}
                    onChange={(e) => setPreco(formatarPrecoDigitado(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Quantidade</label>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Salvar alterações
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
