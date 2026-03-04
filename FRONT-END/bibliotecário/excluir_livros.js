// URL da API responsável pelos livros
const API_URL = 'http://localhost:3000/api/livros';

// Referências ao modal e aos elementos internos
const modal = document.getElementById('modal');
const modalTexto = document.getElementById('modal-texto');
const btnOk = document.getElementById('btn-ok');

// ================================
// INICIALIZAÇÃO DA PÁGINA
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-excluir-livro');

    // Evento ao enviar o formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // impede recarregar a página

        const codigo = document.getElementById('codigo').value.trim();

        // Validação simples
        if (!codigo) {
            mostrarMensagem('Digite o código do livro!', true);
            return;
        }

        // Mostra modal de confirmação antes de excluir
        mostrarConfirmacao(
            `Você deseja mesmo excluir o livro de código ${codigo}?`,
            async () => {
                try {
                    // Envia o DELETE para o backend
                    const resposta = await fetch(`${API_URL}/${codigo}`, {
                        method: 'DELETE'
                    });

                    const data = await resposta.json();

                    // Caso o backend retorne erro
                    if (!resposta.ok) {
                        mostrarMensagem(data.mensagem || 'Erro ao excluir livro', true);
                        return;
                    }

                    // Sucesso
                    mostrarMensagem(`Livro excluído com sucesso! Código: ${codigo}`, false);
                    form.reset();

                } catch (erro) {
                    mostrarMensagem('Erro ao conectar ao servidor', true);
                    console.error('Erro de rede:', erro);
                }
            }
        );
    });
});

// ================================
// FUNÇÃO: mostrarMensagem()
// Exibe o modal com uma mensagem simples
// ================================
function mostrarMensagem(mensagem, erro = false) {
    modalTexto.innerHTML = mensagem;
    modal.style.display = 'flex';

    btnOk.style.display = 'block';
    btnOk.onclick = () => modal.style.display = 'none'; // fecha o modal
}

// ================================
// FUNÇÃO: mostrarConfirmacao()
// Exibe um modal com botões "Sim" e "Não"
// Chamando a função callbackSim() se o usuário confirmar
// ================================
function mostrarConfirmacao(mensagem, callbackSim) {
    modalTexto.innerHTML = mensagem + '<br><br>';

    // Botão "Sim"
    const btnSim = document.createElement('button');
    btnSim.textContent = 'Sim';
    btnSim.style.marginRight = '15px';
    btnSim.onclick = () => {
        modal.style.display = 'none';
        callbackSim(); // executa a ação (excluir livro)
    };

    // Botão "Não"
    const btnNao = document.createElement('button');
    btnNao.textContent = 'Não';
    btnNao.onclick = () => modal.style.display = 'none';

    // Coloca os botões dentro do modal
    modalTexto.appendChild(btnSim);
    modalTexto.appendChild(btnNao);

    // Exibe o modal
    modal.style.display = 'flex';

    // Oculta o botão OK, porque agora será Sim/Não
    btnOk.style.display = 'none';
}