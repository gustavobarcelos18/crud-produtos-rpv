import Link from "next/link";
import { api } from "@/api/axiosInstance";
import { useEffect, useState } from "react";

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja excluir este produto?')) {
      return;
    }

    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((produtosAtuais) => produtosAtuais.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          href="/produtos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Novo Produto
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        {carregando ? (
          <p className="p-6 text-gray-600">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="p-6 text-gray-600">Nenhum produto cadastrado.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">R$ {produto.preco.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{produto.quantidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      href={`/produtos/${produto.id}`}
                      className="inline-block px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleDelete(produto.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
