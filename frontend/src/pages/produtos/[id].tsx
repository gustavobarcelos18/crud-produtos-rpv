import { api } from "@/api/axiosInstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
        setPreco(String(produto.preco));
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
        preco: Number(preco),
        quantidade: Number(quantidade),
      });

      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {carregando ? (
          <p className="text-gray-600">Carregando produto...</p>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
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
  );
}
