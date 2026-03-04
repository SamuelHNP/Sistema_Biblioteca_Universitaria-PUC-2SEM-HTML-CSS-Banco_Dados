const express = require("express");
const router = express.Router();
const { db } = require("../database");

router.post("/", (req, res) => {
    console.log("REQUISIÇÃO CHEGOU NO BACK-END:", req.body);

    //LE OS DADOS QUE CHEGOU DO FRONT-END
    const { ra, codigo } = req.body;

    if (!ra || !codigo) {
        return res.status(400).json({ mensagem: "RA e código são obrigatórios" });
    }

    // 1. Verifica se o aluno existe
    db.query("SELECT * FROM alunos WHERE ra = ?", [ra], (err, alunoResult) => {
        if (err) return res.status(500).json({ mensagem: "Erro ao buscar aluno" });
        if (alunoResult.length === 0)
            return res.status(404).json({ mensagem: "Aluno não encontrado!" });

        const aluno = alunoResult[0];

        // 1.1 Verifica se o aluno já tem um livro ativo
        db.query(
            "SELECT * FROM emprestimos WHERE aluno_ra = ? AND status = 'ATIVO'",
            [ra],
            (err, emprestimosAtivos) => {
                if (err) return res.status(500).json({ mensagem: "Erro ao verificar empréstimos" });

                if (emprestimosAtivos.length > 0) {
                    return res.status(403).json({ mensagem: "Limite de 1 livro ativo por aluno atingido!" });
                }

                // 2. Verifica livro
                db.query("SELECT * FROM livros WHERE codigo = ?", [codigo], (err, livroResult) => {
                    if (err) return res.status(500).json({ mensagem: "Erro ao buscar livro" });
                    if (livroResult.length === 0)
                        return res.status(404).json({ mensagem: "Livro não encontrado!" });

                    const livro = livroResult[0];

                    if (livro.disponivel < 1)
                        return res.status(403).json({ mensagem: "Não há exemplares disponíveis!" });

                    // 3. REGISTRAR EMPRESTIMO E A QUANTIDADE DE DIAS - 15 DIAS
                    const sqlEmprestimo = `
                        INSERT INTO emprestimos 
                        (aluno_ra, livro_codigo, data_retirada, data_prevista_devolucao, status)
                        VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'ATIVO')
                    `;

                    db.query(sqlEmprestimo, [ra, codigo], (err) => {
                        if (err) {
                            console.error("ERRO NO INSERT emprestimos:", err);
                            return res.status(500).json({ mensagem: "Erro ao registrar empréstimo" });
                        }

                        // 4. Atualiza estoque
                        db.query(
                            "UPDATE livros SET disponivel = disponivel - 1 WHERE codigo = ?",
                            [codigo],
                            (err) => {
                                if (err) {
                                    console.error("ERRO AO ATUALIZAR LIVRO:", err);
                                    return res.status(500).json({ mensagem: "Erro ao atualizar estoque" });
                                }

                                return res.status(200).json({
                                    mensagem: "Retirada registrada com sucesso!",
                                    aluno: aluno.nome,
                                    livro: livro.titulo
                                });
                            }
                        );
                    });
                });
            }
        );
    });
});

module.exports = router;
