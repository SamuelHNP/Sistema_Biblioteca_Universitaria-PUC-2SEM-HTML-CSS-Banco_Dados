// Local: FRONT-END/aluno/cadastro.js (FINAL COM VALIDAÇÃO E REDIRECIONAMENTO)

// 1. URL da sua API de Backend
const API_URL = 'http://localhost:3000/api/alunos'; 

// Função que formata o número de telefone (apenas números)
function formatarTelefone(telefone) {
    return telefone.replace(/\D/g, ''); 
}

// Função de validação principal
function validarDados(alunoData) {
    // ... [código da função validarDados aqui - sem alterações] ...
    const { nome, ra, curso, cpf, telefone, email } = alunoData;
    const erros = [];

    // 1. Validação de Campos Obrigatórios (ajuste conforme seu HTML/DB)
    if (!nome || !ra || !cpf || !telefone || !email) {
        erros.push("Todos os campos obrigatórios (Nome, RA, CPF, Telefone, E-mail) devem ser preenchidos.");
    }
    
    // 2. Validação do CPF: 11 dígitos
    const cpfLimpo = cpf.toString().replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        erros.push("O campo CPF deve conter exatamente 11 dígitos.");
    }
    
    // 3. Validação do RA
    if (isNaN(ra) || ra.length === 0) {
        erros.push("O RA deve ser um número válido e preenchido.");
    }

    // 4. Validação do Telefone: 10 ou 11 dígitos
    const telefoneLimpo = formatarTelefone(telefone);
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        erros.push("O telefone deve conter o DDD e número (10 ou 11 dígitos).");
    }

    if (erros.length > 0) {
        alert("Corrija os seguintes erros antes de enviar:\n\n- " + erros.join('\n- '));
        return false;
    }
    return true;
}


document.addEventListener('DOMContentLoaded', () => {
    const formAluno = document.getElementById('form-cadastro-aluno');
    
    if (formAluno) {
        formAluno.addEventListener('submit', async function(event) {
            event.preventDefault(); 

            let alunoData = { 
                nome: document.getElementById('nome').value.trim(),
                ra: document.getElementById('ra').value.trim(),
                curso: document.getElementById('curso').value.trim(),
                cpf: document.getElementById('cpf').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                email: document.getElementById('email').value.trim()
            };
            
            if (!validarDados(alunoData)) {
                return;
            }

            // Formatação Final: Aplica a formatação no telefone antes de enviar
            alunoData.telefone = formatarTelefone(alunoData.telefone);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alunoData), 
                });

                if (response.ok) {
                    // Sucesso
                    alert('Aluno cadastrado com sucesso! Redirecionando...');
                    
                    // ==================================================
                    // REDIRECIONAMENTO APÓS SUCESSO
                    window.location.href = 'tela_inicial.html';
                    // ==================================================

                } else {
                    // Erro do servidor
                    const errorData = await response.json();
                    alert(`Falha no cadastro: ${errorData.mensagem || 'Erro desconhecido.'}`);
                }
            } catch (error) {
                // Erro de rede
                alert('Erro de conexão com o servidor. Verifique se o Backend está rodando.');
                console.error('Erro de rede:', error);
            }
        });
    } else {
        console.error('Formulário de cadastro de aluno não encontrado!');
    }
});