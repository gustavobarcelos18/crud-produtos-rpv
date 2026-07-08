import Link from "next/link";
import { api } from "@/api/axiosInstance";
import { useEffect, useState } from "react";

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string;
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

  const formatarPreco = (preco: number | string) => {
    const valor = typeof preco === 'number' ? preco : Number(String(preco).replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'));

    if (Number.isNaN(valor)) {
      return 'R$ 0,00';
    }

    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
            <p className="text-sm text-gray-600">Gerencie seu catálogo de produtos.</p>
          </div>
          <Link
            href="/produtos/novo"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Novo Produto
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {carregando ? (
            <p className="p-6 text-gray-600">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="p-6 text-gray-600">Nenhum produto cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{produto.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatarPreco(produto.preco)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{produto.quantidade}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/produtos/${produto.id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            onClick={() => handleDelete(produto.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
