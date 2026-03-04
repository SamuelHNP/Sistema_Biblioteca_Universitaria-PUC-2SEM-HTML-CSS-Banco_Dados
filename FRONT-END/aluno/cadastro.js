// URL base da API onde o backend está rodando
const API_URL = 'http://localhost:3000/api/alunos';

// Função para remover formatações anteriores de erro
function limparErros() {
    // Seleciona todos os campos <input> da página
    document.querySelectorAll('input').forEach(input => {
        // Remove a classe CSS que marca o campo como inválido
        input.classList.remove('campo-invalido');
    });
}

// Função para exibir um modal (janela de aviso)
function mostrarModal(mensagem) {
    // Pega os elementos do modal no HTML
    const modal = document.getElementById('modal');
    const modalTexto = document.getElementById('modal-texto');
    const btnOk = document.getElementById('btn-ok');

    // Define o texto do modal com a mensagem recebida
    modalTexto.innerHTML = mensagem;

    // Exibe o modal (flex para centralizar o conteúdo)
    modal.style.display = 'flex';

    // Quando o botão "OK" for clicado, o modal é fechado
    btnOk.onclick = () => modal.style.display = 'none';
}

// Função para validar todos os campos obrigatórios
function validarCampos() {
    // Remove erros antigos antes de validar 
    limparErros();

    // Lista de campos obrigatórios
    const campos = ['nome', 'ra', 'curso', 'cpf', 'telefone', 'email'];
    let valido = true; // Assume que está tudo válido

    // Percorre todos os campos obrigatórios
    campos.forEach(id => {
        const campo = document.getElementById(id);
        // Se o campo estiver vazio, marca como inválido
        if (campo.value.trim() === '') {
            campo.classList.add('campo-invalido');
            valido = false;
        }
    });

    // -------- Validação extra para RA --------
    const ra = document.getElementById('ra').value.trim();
    // Remove caracteres não numéricos e verifica se tem 11 dígitos
    if (ra && ra.replace(/\D/g, '').length !== 8) {
        document.getElementById('ra').classList.add('campo-invalido');
        valido = false;
    }

    // -------- Validação extra para CPF --------
    const cpf = document.getElementById('cpf').value.trim();
    // Remove caracteres não numéricos e verifica se tem 11 dígitos
    if (cpf && cpf.replace(/\D/g, '').length !== 11) {
        document.getElementById('cpf').classList.add('campo-invalido');
        valido = false;
    }

    // -------- Validação extra para Telefone --------
    const telefone = document.getElementById('telefone').value.trim();
    const telLimpo = telefone.replace(/\D/g, ''); // Remove formatação
    // Telefone deve ter entre 10 e 11 dígitos
    if (telLimpo && (telLimpo.length < 10 || telLimpo.length > 11)) {
        document.getElementById('telefone').classList.add('campo-invalido');
        valido = false;
    }

    // Retorna true se tudo estiver válido, false se tiver erro
    return valido;
}

// Função para marcar o campo duplicado (vindos do backend)
function marcarCampoDuplicado(erro) {
    const erroTexto = erro.toLowerCase(); // Converte mensagem para minúscula

    // Analisa a mensagem de erro e marca o campo correto
    if (erroTexto.includes('cpf')) {
        document.getElementById('cpf').classList.add('campo-invalido');
    } else if (erroTexto.includes('ra')) {
        document.getElementById('ra').classList.add('campo-invalido');
    } else if (erroTexto.includes('email')) {
        document.getElementById('email').classList.add('campo-invalido');
    }
}

// Envio do formulário de cadastro
document.addEventListener('DOMContentLoaded', () => {
    // Espera o DOM ser carregado e pega o formulário
    const form = document.getElementById('form-cadastro-aluno');

    // Adiciona o evento de "submit" (quando o usuário clica em "Cadastrar")
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        limparErros(); // Limpa formatações antigas

        // Valida os campos antes de enviar
        if (!validarCampos()) {
            mostrarModal("Dados Inválidos! Preencha novamente.");
            return; // Interrompe o envio se houver erro
        }

        // Monta o objeto com os dados do aluno
        const alunoData = {
            nome: document.getElementById('nome').value.trim(),
            ra: document.getElementById('ra').value.trim(),
            curso: document.getElementById('curso').value.trim(),
            cpf: document.getElementById('cpf').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        // ---------------- Envio dos dados para o servidor ----------------
        try {
            // Envia os dados via POST para o backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Informa que o corpo é JSON
                body: JSON.stringify(alunoData) // Converte o objeto para texto JSON
            });

            // Aguarda a resposta do servidor e converte em JSON
            const data = await response.json();

            // Se o servidor retornar erro (status diferente de 200)
            if (!response.ok) {
                // Marca o campo duplicado com base na mensagem do backend
                marcarCampoDuplicado(data.detalhes || data.mensagem || '');
                // Exibe o erro em um modal
                mostrarModal(`Falha no cadastro:<br>${data.mensagem || 'Erro desconhecido.'}`);
                return;
            }

            // Se deu tudo certo:
            mostrarModal("Aluno cadastrado com sucesso!");
            form.reset(); // Limpa o formulário

            // Após 2 segundos, redireciona para a tela inicial
            setTimeout(() => {
                window.location.href = 'tela_inicial.html';
            }, 2000);

        } catch (error) {
            // Caso não consiga se conectar ao servidor
            mostrarModal("Erro de conexão com o servidor.");
            console.error('Erro de rede:', error);
        }
    });
});
