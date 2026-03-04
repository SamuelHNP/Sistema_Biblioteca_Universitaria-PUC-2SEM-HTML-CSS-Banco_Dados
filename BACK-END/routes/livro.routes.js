const express = require('express');
const router = express.Router();
<<<<<<< HEAD
// 1. Importa a conexão com o banco que você criou no database.js
const { db } = require('../database'); 

// Recebe os dados enviados 
// pelo front-end quando o bibliotecario faz o cadastro de um livro.
router.post('/livros', (req, res) => {
    // Desestrutura os dados do corpo da requisição (JSON do Front-end)
    // Os nomes das variáveis devem ser EXATOS aos IDs dos inputs do seu cadastro_livro.js
    const { titulo, codigo, editora, autor, ano } = req.body; 

    // 2. Query SQL de INSERÇÃO. O nome das colunas deve ser EXATO ao do seu DB!
    const sql = 'INSERT INTO livros (titulo, codigo, editora, autor, ano) VALUES (?, ?, ?, ?, ?)';
    
    // Array com os valores que substituem os '?' na ordem correta
    const values = [titulo, codigo, editora, autor, ano];

    // 3. Executa a query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar livro:", err);
            
            // Você pode verificar se o erro é de chave única (ex: código já existe)
            if (err.code === 'ER_DUP_ENTRY') {
                 return res.status(409).json({ 
                    mensagem: "Erro: O código do livro já está cadastrado.", 
                    detalhes: err.message
                });
            }
            
            // Erro genérico do servidor
            return res.status(500).json({ 
                mensagem: "Erro interno do servidor ao cadastrar livro.", 
                detalhes: err.message 
            });
        }

        // Resposta de Sucesso (Status 201: Criado)
        return res.status(201).json({ 
            mensagem: "Livro cadastrado com sucesso!", 
            id: result.insertId // Retorna o ID do livro recém-inserido
=======
const { db } = require('../database');

// ============================
// ROTA DE CADASTRO DE LIVRO
// ============================
router.post('/livros', (req, res) => {
    const { titulo, codigo, editora, autor, ano, quantidade } = req.body;

    // --- VALIDAÇÃO ---
    if (!titulo || !codigo || !editora || !autor || !ano || !quantidade) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios!"
        });
    }

    // converter quantidade em número
    const qtd = Number(quantidade);

    if (isNaN(qtd) || qtd <= 0) {
        return res.status(400).json({
            mensagem: "Quantidade deve ser um número válido maior que zero."
        });
    }

    // --- SQL usando nomes reais da TABELA ---
    const sql = `
        INSERT INTO livros 
        (codigo, titulo, editora, autor, ano, total_copias, disponivel)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        codigo,
        titulo,
        editora,
        autor,
        ano,
        qtd, // total de cópias
        qtd  // inicia com todas disponíveis
    ];

    // Executa o INSERT no banco
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar livro:", err);

            // Se o código já existir, MySQL retorna erro de duplicidade
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    mensagem: "Erro: O código do livro já está cadastrado.",
                });
            }

            return res.status(500).json({
                mensagem: "Erro interno ao cadastrar livro.",
                detalhes: err.message
            });
        }

        return res.status(201).json({
            mensagem: "Livro cadastrado com sucesso!",
            id: result.insertId
>>>>>>> bb50abb (Versão final)
        });
    });
});

<<<<<<< HEAD
module.exports = router;
=======
// ============================
// DELETAR LIVRO PELO CÓDIGO
// ============================

router.delete('/livros/:codigo', (req, res) => {
    const { codigo } = req.params;

    //Se codigo estiver certo, vai para deletar
    db.query('SELECT * FROM livros WHERE codigo = ?', [codigo], (err, results) => {
        if (err) return res.status(500).json({ mensagem: "Erro ao consultar o livro" });

        if (results.length === 0)
            return res.status(404).json({ mensagem: "Livro não encontrado" });

        //DELETAR LIVRO
        db.query('DELETE FROM livros WHERE codigo = ?', [codigo], (err) => {
            if (err) return res.status(500).json({ mensagem: "Erro ao excluir livro" });

            return res.status(200).json({
                mensagem: `Livro de código ${codigo} excluído com sucesso!`
            });
        });
    });
});

// ============================
// LISTAR LIVROS DISPONÍVEIS
// ============================

router.get('/livros/disponiveis', (req, res) => {
    const sql = `
        SELECT codigo, titulo
        FROM livros
        WHERE disponivel > 0
    `;

    //INSERINDO NO BANCO
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar disponíveis:", err);
            return res.status(500).json({ error: 'Erro ao buscar livros disponíveis.' });
        }
        res.json(results);
    });
});

// ============================
// LISTAR TODOS OS LIVROS (PARA BIBLIOTECÁRIO)
// ============================
router.get('/livros', (req, res) => {
    const sql = `
        SELECT 
            codigo,
            titulo,
            editora,
            autor,
            ano,
            total_copias,
            disponivel
        FROM livros
        ORDER BY titulo ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao listar todos os livros:", err);
            return res.status(500).json({ error: 'Erro ao listar todos os livros.' });
        }
        res.json(results);
    });
});

module.exports = router;
>>>>>>> bb50abb (Versão final)
