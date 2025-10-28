// BACK-END/routes/alunoRoutes.js MYSQL/mysql2

const express = require('express');
const router = express.Router();
// 1. Importe a conexão com o banco que você criou no database.js
const { db } = require('../database'); 

// Rota POST para /api/alunos
router.post('/alunos', (req, res) => {
    // Desestrutura os dados do corpo da requisição (JSON do Front-end)
    const { nome, ra, curso, cpf, telefone, email } = req.body; 

    // 2. Query SQL de INSERÇÃO.
    const sql = 'INSERT INTO alunos (nome, ra, curso, cpf, telefone, email) VALUES (?, ?, ?, ?, ?, ?)';
    
    // Array com os valores que substituem os '?' na ordem correta
    const values = [nome, ra, curso, cpf, telefone, email];

    // 3. Executa a query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar aluno:", err);
            // 4. Se der erro (ex: duplicidade), retorna uma resposta 500 ou 409
            return res.status(500).json({ 
                mensagem: "Erro ao cadastrar aluno. Verifique o log do servidor.", 
                detalhes: err.message 
            });
        }

        // Resposta de Sucesso (Status 201: Criado)
        return res.status(201).json({ 
            mensagem: "Aluno cadastrado com sucesso!", 
            id: result.insertId 
        });
    });
});

module.exports = router;