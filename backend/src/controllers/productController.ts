import { Request, Response } from 'express'
import { db } from '../database/connection'

// GET /produtos (aceitar ?q= para busca por nome, ex: whereILike igual ao exemplo de /users)
export const getProducts = async (req: Request, res: Response) => {
    try {
        const q = String(req.query.q || '').trim()

        const query = db('produtos').select('*')

        if (q) {
            query.whereILike('nome', `%${q}%`)
        }

        const produtos = await query

        return res.status(200).json({ data: produtos })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar produtos.' })
    }
}

// GET /produtos/:id
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const produto = await db('produtos').where({ id }).first()

        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ data: produto })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar produto.' })
    }
}

// POST /produtos
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { nome, descricao, preco, quantidade } = req.body

        if (!nome || !descricao || preco == null || quantidade == null) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
        }

        const precoNumero = Number(preco)
        const quantidadeNumero = Number(quantidade)

        if (Number.isNaN(precoNumero) || Number.isNaN(quantidadeNumero)) {
            return res.status(400).json({ message: 'Preço e quantidade devem ser números.' })
        }

        await db('produtos').insert({
            nome,
            descricao,
            preco: precoNumero,
            quantidade: quantidadeNumero
        })

        return res.status(201).json({ message: 'Produto criado com sucesso.' })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar produto.' })
    }
}

// PUT /produtos/:id
export const updateProduct = async (req: Request, res: Response) => {
    // TODO: atualizar um produto existente (req.params.id + req.body)
    // Se não encontrar, retornar 404
    return res.status(501).json({ message: 'Atualização de produto ainda não implementada.' })
}

// DELETE /produtos/:id
export const deleteProduct = async (req: Request, res: Response) => {
    // TODO: remover um produto pelo id (req.params.id)
    // Se não encontrar, retornar 404
    return res.status(501).json({ message: 'Exclusão de produto ainda não implementada.' })
}
