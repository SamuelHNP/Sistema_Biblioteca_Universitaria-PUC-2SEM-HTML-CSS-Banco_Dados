const express = require("express");
const router = express.Router();
const { db } = require('../database');

// ROTA PARA LISTAR TODOS OS EMPRÉSTIMOS
router.get("/", (req, res) => {
    const sql = `
        SELECT 
            e.id,
            a.nome AS aluno,
            a.ra AS ra,
            a.pontuacao AS pontos,  
            l.titulo AS livro,
            e.data_retirada,
            e.data_devolucao,
            e.status
        FROM emprestimos e
        INNER JOIN alunos a ON a.ra = e.aluno_ra
        INNER JOIN livros l ON l.codigo = e.livro_codigo
        ORDER BY e.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erro SQL:", err);
            return res.status(500).json({ erro: "Erro no servidor ao listar empréstimos." });
        }
        res.json(result);
    });
});

module.exports = router;
