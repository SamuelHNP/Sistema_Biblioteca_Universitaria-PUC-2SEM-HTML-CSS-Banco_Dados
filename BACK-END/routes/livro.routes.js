// BACK-END/routes/livroRoutes.js (CORRIGIDO PARA MYSQL/mysql2)

const express = require('express');
const router = express.Router();
// 1. Importa a conexão com o banco que você criou no database.js
const { db } = require('../database'); 

// Rota POST para /api/livros
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
        });
    });
});

module.exports = router;