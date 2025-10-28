// FUNÇÃO: Fazer o formulário funcionar de forma inteligente 
// validando, enviando e exibindo mensagens ao usuário.

// Local: FRONT-END/aluno/cadastro.js

// 1. URL da sua API de Backend
const API_URL = 'http://localhost:3000/api/alunos'; 

// Função que formata o número de telefone (remove caracteres não numéricos)
function formatarTelefone(telefone) {
    return telefone.replace(/\D/g, ''); 
}

// Função de validação principal
function validarDados(alunoData) {
    const { nome, ra, curso, cpf, telefone, email } = alunoData;
    const erros = [];

    // 1. Campos obrigatórios
    if (!nome || !ra || !cpf || !telefone || !email) {
        erros.push("Todos os campos obrigatórios (Nome, RA, CPF, Telefone, E-mail) devem ser preenchidos.");
    }
    
    // 2. CPF: 11 dígitos
    const cpfLimpo = cpf.toString().replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        erros.push("O CPF deve conter exatamente 11 dígitos.");
    }
    
    // 3. RA deve ser numérico
    if (isNaN(ra) || ra.length === 0) {
        erros.push("O RA deve ser um número válido e preenchido.");
    }

    // 4. Telefone: 10 ou 11 dígitos
    const telefoneLimpo = formatarTelefone(telefone);
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        erros.push("O telefone deve conter o DDD e número (10 ou 11 dígitos).");
    }

    // Se houver erros, exibe todos dentro da página
    if (erros.length > 0) {
        mostrarMensagem("Corrija os seguintes erros:<br> - " + erros.join("<br> - "), "erro");
        return false;
    }
    return true;
}

// Função para mostrar mensagens dentro da página (sem alert)
function mostrarMensagem(texto, tipo) {
    const msg = document.getElementById('mensagem');
    msg.innerHTML = texto;        // aceita HTML (como <br>)
    msg.className = tipo;         // aplica a classe CSS .erro ou .sucesso
    msg.style.display = 'block';  // mostra a mensagem

    // Oculta automaticamente após 4 segundos (opcional)
    setTimeout(() => {
        msg.style.display = 'none';
    }, 4000);
}

// Quando o DOM estiver carregado
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

            // Formata o telefone antes de enviar
            alunoData.telefone = formatarTelefone(alunoData.telefone);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alunoData), 
                });

                if (response.ok) {
                    // Sucesso: mostra mensagem e redireciona
                    mostrarMensagem('Aluno cadastrado com sucesso! Redirecionando...', 'sucesso');

                    setTimeout(() => {
                        window.location.href = 'tela_inicial.html';
                    }, 2000);

                } else {
                    // Erro retornado pelo servidor
                    const errorData = await response.json();
                    mostrarMensagem(`Falha no cadastro: ${errorData.mensagem || 'Erro desconhecido.'}`, 'erro');
                }
            } catch (error) {
                // Erro de rede ou servidor offline
                mostrarMensagem('Erro de conexão com o servidor. Verifique se o Backend está rodando.', 'erro');
                console.error('Erro de rede:', error);
            }
        });
    } else {
        console.error('Formulário de cadastro de aluno não encontrado!');
    }
});
