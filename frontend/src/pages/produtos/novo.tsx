import { api } from "@/api/axiosInstance";
import { useRouter } from "next/router";
import { useState } from "react";

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

export default function NovoProduto() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post('/produtos', {
        nome,
        descricao,
        preco: Number(String(preco).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".")),
        quantidade: Number(quantidade),
      });

      router.push('/produtos');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
          <p className="text-sm text-gray-600">Cadastre um novo item no catálogo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-900">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
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
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
