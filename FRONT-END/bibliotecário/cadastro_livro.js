// Local: FRONT-END/bibliotecário/cadastro_livro.js

// 1. URL da sua API de Backend para LIVROS
const API_URL_LIVRO = 'http://localhost:3000/api/livros'; 

document.addEventListener('DOMContentLoaded', () => {
    const formLivro = document.getElementById('form-cadastro-livro');
    
    if (formLivro) {
        formLivro.addEventListener('submit', async function(event) {
            event.preventDefault(); 

            // 2. Coleta os dados de todos os campos do formulário de LIVRO
            const livroData = {
                // Verifique que os IDs dos inputs no HTML (ex: titulo) são usados aqui
                titulo: document.getElementById('titulo').value,
                codigo: document.getElementById('codigo').value,
                editora: document.getElementById('editora').value,
                autor: document.getElementById('autor').value,
                ano: document.getElementById('ano').value 
            };
            
            console.log('Dados do Livro para envio:', livroData);

            try {
                // 3. Envia os dados para a API de livros
                const response = await fetch(API_URL_LIVRO, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(livroData), 
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Livro cadastrado com sucesso!');
                    console.log('Resposta do Servidor:', data);
                    formLivro.reset(); 
                } else {
                    const errorData = await response.json();
                    alert(`Falha no cadastro de livro: ${errorData.mensagem || 'Erro desconhecido.'}`);
                }
            } catch (error) {
                alert('Erro de conexão com o servidor. Verifique se o Backend está rodando.');
                console.error('Erro de rede:', error);
            }
        });
    } else {
        console.error('Formulário de cadastro de livro não encontrado! Verifique o ID.');
    }
});