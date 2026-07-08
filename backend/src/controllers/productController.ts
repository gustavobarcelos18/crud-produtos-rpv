import { Request, Response } from 'express'
import { db } from '../database/connection'

const parseDecimalValue = (value: unknown) => {
    if (typeof value === 'number') {
        return value
    }

    if (typeof value === 'string') {
        const normalized = value.trim().replace(/\./g, '').replace(',', '.')
        const parsed = Number(normalized)

        if (!Number.isNaN(parsed)) {
            return parsed
        }
    }

    return Number.NaN
}

const parseIntegerValue = (value: unknown) => {
    if (typeof value === 'number') {
        return value
    }

    if (typeof value === 'string') {
        const parsed = Number(value)

        if (Number.isInteger(parsed)) {
            return parsed
        }
    }

    return Number.NaN
}

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

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido.' })
        }

        const produto = await db('produtos').where({ id }).first()

        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ data: produto })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar produto.' })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { nome, descricao, preco, quantidade } = req.body

        if (typeof nome !== 'string' || typeof descricao !== 'string' || !nome.trim() || !descricao.trim() || preco == null || quantidade == null) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
        }

        const precoNumero = parseDecimalValue(preco)
        const quantidadeNumero = parseIntegerValue(quantidade)

        if (Number.isNaN(precoNumero) || Number.isNaN(quantidadeNumero)) {
            return res.status(400).json({ message: 'Preço e quantidade devem ser números.' })
        }

        await db('produtos').insert({
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: precoNumero,
            quantidade: quantidadeNumero
        })

        return res.status(201).json({ message: 'Produto criado com sucesso.' })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar produto.' })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido.' })
        }

        const produtoExistente = await db('produtos').where({ id }).first()

        if (!produtoExistente) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        const { nome, descricao, preco, quantidade } = req.body

        if (nome == null || descricao == null || preco == null || quantidade == null) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
        }

        const precoNumero = parseDecimalValue(preco)
        const quantidadeNumero = parseIntegerValue(quantidade)

        if (Number.isNaN(precoNumero) || Number.isNaN(quantidadeNumero)) {
            return res.status(400).json({ message: 'Preço e quantidade devem ser números.' })
        }

        await db('produtos').where({ id }).update({
            nome: String(nome).trim(),
            descricao: String(descricao).trim(),
            preco: precoNumero,
            quantidade: quantidadeNumero
        })

        const produtoAtualizado = await db('produtos').where({ id }).first()

        return res.status(200).json({ message: 'Produto atualizado com sucesso.', data: produtoAtualizado })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar produto.' })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido.' })
        }

        const produtoExistente = await db('produtos').where({ id }).first()

        if (!produtoExistente) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        await db('produtos').where({ id }).del()

        return res.status(200).json({ message: 'Produto excluído com sucesso.' })
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao excluir produto.' })
    }
}
