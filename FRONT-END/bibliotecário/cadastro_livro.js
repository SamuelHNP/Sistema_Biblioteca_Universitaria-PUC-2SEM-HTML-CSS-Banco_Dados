// URL da API do backend para cadastro de livros
const API_URL_LIVRO = 'http://localhost:3000/api/livros';

document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o formulário dentro da div
    const formLivro = document.querySelector('#form-cadastro-livro form');

    // Seleciona a div que mostrará as mensagens
    const mensagemDiv = document.getElementById('mensagem');

    if (formLivro) {
        // Evento ao enviar o formulário
        formLivro.addEventListener('submit', async function(event) {
            event.preventDefault(); // previne envio padrão do form

            // Pega os valores dos inputs e remove espaços extras
            const livroData = {
                titulo: document.getElementById('titulo').value.trim(),
                codigo: document.getElementById('codigo').value.trim(),
                editora: document.getElementById('editora').value.trim(),
                autor: document.getElementById('autor').value.trim(),
                ano: document.getElementById('ano').value.trim()
            };

            try {
                // Envia os dados para a API usando POST
                const response = await fetch(API_URL_LIVRO, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(livroData)
                });

                if (response.ok) {
                    // Cadastro bem-sucedido
                    const data = await response.json();
                    mostrarMensagem('Livro cadastrado com sucesso!', 'sucesso');
                    console.log('Resposta do Servidor:', data);
                    formLivro.reset(); // limpa o formulário
                } else {
                    // Erro retornado pelo backend
                    const errorData = await response.json();
                    mostrarMensagem(`Falha no cadastro de livro: ${errorData.mensagem || 'Erro desconhecido.'}`, 'erro');
                }
            } catch (error) {
                // Erro de conexão
                mostrarMensagem('Erro de conexão com o servidor. Verifique se o Backend está rodando.', 'erro');
                console.error('Erro de rede:', error);
            }
        });
    } else {
        console.error('Formulário de cadastro de livro não encontrado! Verifique o ID.');
    }

    // Função para exibir mensagens dentro da div
    function mostrarMensagem(texto, tipo) {
        mensagemDiv.textContent = texto; // texto da mensagem
        mensagemDiv.className = `mensagem ${tipo}`; // aplica classe de sucesso ou erro
        mensagemDiv.style.display = 'block';
        mensagemDiv.style.opacity = '1';

        // Oculta a mensagem depois de 5 segundos com fade
        setTimeout(() => {
            mensagemDiv.style.opacity = '0';
            setTimeout(() => {
                mensagemDiv.style.display = 'none';
            }, 500); // tempo do fade
        }, 5000);
    }
});
