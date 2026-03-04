const express = require('express');
const router = express.Router();
// 1. Importe a conexão com o banco no database.js
const { db } = require('../database'); 

<<<<<<< HEAD
// Rota POST para /api/alunos
router.post('/alunos', (req, res) => {
    // Desestrutura os dados do corpo da                                                                                                                                                                                                                                                                                                                             requisição (JSON do Front-end)
    const { nome, ra, curso, cpf, telefone, email } = req.body; 

    // 2. Query SQL de INSERÇÃO.
=======
// ============================
// ROTA DE CADASTRO DE ALUNO
// ============================
// Rota POST para /api/alunos
//ENVIAR PARA O SERVIDOR
router.post('/alunos', (req, res) => {
    // Desestrutura os dados do co
    // rpo da                                                                                                                                                                                                                                                                                                                             requisição (JSON do Front-end)
    const { nome, ra, curso, cpf, telefone, email } = req.body; 

    // 2. Query SQL de INSERÇÃO.(consulta)
>>>>>>> bb50abb (Versão final)
    const sql = 'INSERT INTO alunos (nome, ra, curso, cpf, telefone, email) VALUES (?, ?, ?, ?, ?, ?)';
    
    // Array com os valores que substituem os '?' na ordem correta
    const values = [nome, ra, curso, cpf, telefone, email];

    // 3. Executa a query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar aluno:", err);
            // 4. Se der erro (ex: duplicidade), retorna uma resposta 500 ou 409
            return res.status(500).json({ 
                mensagem: "Erro ao cadastrar aluno. Dados já existentes!.", 
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

<<<<<<< HEAD
=======
// ============================
// ROTA DE LOGIN DE ALUNO
// ============================
router.post('/alunos/login', (req, res) => {
    const { ra, cpf } = req.body;

    if (!ra || !cpf) {
        return res.status(400).json({ mensagem: "RA e CPF são obrigatórios" });
    }

    const sql = "SELECT * FROM alunos WHERE ra = ? AND cpf = ?";
    db.query(sql, [ra, cpf], (err, results) => {
        if (err) {
            console.error("Erro no login:", err);
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ mensagem: "RA ou CPF inválidos" });
        }

        // Login OK
        return res.status(200).json({ mensagem: "Login realizado com sucesso!", aluno: results[0] });
    });
});

>>>>>>> bb50abb (Versão final)
module.exports = router;