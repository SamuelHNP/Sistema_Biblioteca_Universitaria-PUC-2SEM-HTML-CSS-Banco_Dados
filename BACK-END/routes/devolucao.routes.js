const express = require("express");
const router = express.Router();
const { db } = require("../database");

// ================================================
// PROCESSAR DEVOLUÇÃO
// ================================================
router.post("/", (req, res) => {
    const { ra, codigo } = req.body;

    if (!ra || !codigo) {
        return res.status(400).json({
            mensagem: "RA e código do livro são obrigatórios."
        });
    }

    // ================================================
    // 1) BUSCAR EMPRÉSTIMO ATIVO
    // ================================================
    const sqlBusca = `
        SELECT id, data_retirada
        FROM emprestimos
        WHERE aluno_ra = ?
        AND livro_codigo = ?
        AND status = 'ATIVO'
        LIMIT 1
    `;

    db.query(sqlBusca, [ra, codigo], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar empréstimo:", erro);
            return res.status(500).json({ mensagem: "Erro ao buscar empréstimo." });
        }

        if (resultados.length === 0) {
            return res.status(400).json({
                mensagem: "Nenhum empréstimo ativo encontrado para este RA e código."
            });
        }

        const emprestimo = resultados[0];
        const emprestimoId = emprestimo.id;
        const dataRetirada = new Date(emprestimo.data_retirada);
        const hoje = new Date();

        // Calcular diferença em dias
        const diffMs = hoje - dataRetirada;
        const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // ==================================================
        // 2) VERIFICAR SE DEVOLVEU NO PRAZO (15 dias)
        // ==================================================
        let ganhouPonto = false;
        if (dias <= 15) {
            ganhouPonto = true;
        }

        // ==================================================
        // 3) ATUALIZAR EMPRÉSTIMO PARA DEVOLVIDO
        // ==================================================
        const sqlDevolver = `
            UPDATE emprestimos
            SET status = 'DEVOLVIDO', data_devolucao = NOW()
            WHERE id = ?
        `;

        db.query(sqlDevolver, [emprestimoId], (erro2) => {
            if (erro2) {
                console.error("Erro ao atualizar empréstimo:", erro2);
                return res.status(500).json({ mensagem: "Erro ao registrar devolução." });
            }

            // ==================================================
            // 4) DEVOLVE 1 LIVRO À DISPONIBILIDADE | VOLTA A FICAR
            // ==================================================
            const sqlLivro = `
                UPDATE livros
                SET disponivel = disponivel + 1
                WHERE codigo = ?
            `;

            db.query(sqlLivro, [codigo], (erro3) => {
                if (erro3) {
                    console.error("Erro ao atualizar livro:", erro3);
                    return res.status(500).json({ mensagem: "Erro ao atualizar disponibilidade." });
                }

                // ==================================================
                // 5) SE DEVOLVEU NO PRAZO → +1 PONTO
                // ==================================================
                if (ganhouPonto) {
                    const sqlPonto = `
                        UPDATE alunos
                        SET pontuacao = pontuacao + 1
                        WHERE ra = ?
                    `;

                    db.query(sqlPonto, [ra], (erro4) => {
                        if (erro4) {
                            console.error("Erro ao atualizar pontuação:", erro4);
                        }

                        return res.status(200).json({
                            mensagem: "Devolução registrada com sucesso! Você ganhou +1 ponto"
                        });
                    });

                } else {
                    // SEM PONTO
                    return res.status(200).json({
                        mensagem: "Devolução registrada com sucesso! (Sem pontuação — devolvido fora do prazo)"
                    });
                }
            });
        });
    });
});

module.exports = router;
