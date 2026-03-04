// routes/pontuacao.routes.js
const express = require("express");
const router = express.Router();
const { db } = require("../database");

// =====================================
// ROTA PARA CONSULTAR PONTUAÇÃO DO ALUNO
// =====================================
router.get("/:ra", (req, res) => {
    const { ra } = req.params;

    if (!ra) {
        return res.status(400).json({ mensagem: "O RA é obrigatório." });
    }

    const sql = `SELECT nome, ra, pontuacao FROM alunos WHERE ra = ?`;

    db.query(sql, [ra], (erro, resultado) => {
        if (erro) {
            console.error("Erro ao buscar pontuação:", erro);
            return res.status(500).json({ mensagem: "Erro ao buscar pontuação." });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Aluno não encontrado." });
        }

        return res.status(200).json({
            nome: resultado[0].nome,
            ra: resultado[0].ra,
            pontuacao: resultado[0].pontuacao
        });
    });
});

module.exports = router;
