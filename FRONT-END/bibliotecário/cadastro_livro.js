// URL da API do backend para cadastro de livros
const API_URL_LIVRO = 'http://localhost:3000/api/livros';

// Função para limpar erros anteriores nos campos
function limparErros() {
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('campo-invalido');
    });
}

// Função para mostrar modal de mensagem
function mostrarModal(mensagem) {
    const modal = document.getElementById('modal');
    const modalTexto = document.getElementById('modal-texto');
    const btnOk = document.getElementById('btn-ok');

    modalTexto.innerHTML = mensagem;
    modal.style.display = 'flex';

    btnOk.onclick = () => modal.style.display = 'none';
}

// Função para validar os campos do formulário
function validarCampos() {
    limparErros();

<<<<<<< HEAD
    const campos = ['titulo', 'codigo', 'editora', 'autor', 'ano'];
=======
    const campos = ['titulo', 'codigo', 'editora', 'autor', 'ano', 'quantidade'];
>>>>>>> bb50abb (Versão final)
    let valido = true;

    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo.value.trim()) {
            campo.classList.add('campo-invalido');
            valido = false;
        }
    });

    const anoInput = document.getElementById('ano');
    const ano = anoInput.value.trim();
    const anoNumerico = parseInt(ano);

    if (ano && (isNaN(anoNumerico) || ano.length !== 4 || anoNumerico <= 0)) {
        anoInput.classList.add('campo-invalido');
        valido = false;
    }

    return valido;
}

// Função para marcar campos duplicados
function marcarCampoDuplicado(erro) {
    const erroTexto = erro.toLowerCase();
    if (erroTexto.includes('codigo') || erroTexto.includes('código')) {
        document.getElementById('codigo').classList.add('campo-invalido');
    }
}

// Código principal - espera o carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    const formLivro = document.getElementById('form-cadastro-livro');

    if (!formLivro) {
        console.error('Formulário de cadastro de livro não encontrado! Verifique o ID.');
        return;
    }

    formLivro.addEventListener('submit', async (event) => {
        event.preventDefault();
        limparErros();

        if (!validarCampos()) {
            mostrarModal("Dados inválidos! Preencha todos os campos corretamente.");
            return;
        }

        const livroData = {
            titulo: document.getElementById('titulo').value.trim(),
            codigo: document.getElementById('codigo').value.trim(),
            editora: document.getElementById('editora').value.trim(),
            autor: document.getElementById('autor').value.trim(),
<<<<<<< HEAD
            ano: document.getElementById('ano').value.trim()
=======
            ano: document.getElementById('ano').value.trim(),
            quantidade: document.getElementById('quantidade').value.trim()
>>>>>>> bb50abb (Versão final)
        };

        try {
            const response = await fetch(API_URL_LIVRO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(livroData)
            });

<<<<<<< HEAD
            // Tente converter para JSON. Se falhar, vai direto para o 'catch' externo.
             const data = await response.json(); // <--- SEM TRY/CATCH ANINHADO
=======
            const data = await response.json();
>>>>>>> bb50abb (Versão final)

            if (response.ok) {
                mostrarModal(data.mensagem || 'Livro cadastrado com sucesso!');
                formLivro.reset();
            } else if (response.status === 409) {
                marcarCampoDuplicado(data.detalhes || data.mensagem || '');
                mostrarModal(data.mensagem || 'Erro: código duplicado.');
            } else {
                mostrarModal(data.mensagem || `Erro no cadastro (status ${response.status})`);
            }

        } catch (error) {
<<<<<<< HEAD
            // Agora, se cair aqui, é porque houve um erro de rede OU a resposta não era JSON,
            // mas em ambos os casos a mensagem de conexão é a mais apropriada.
            mostrarModal('Erro de conexão com o servidor. Verifique se o backend está rodando.');
            console.error('Erro de rede ou falha na leitura JSON:', error);
        }
    });
});
=======
            mostrarModal('Erro de conexão com o servidor. Verifique se o backend está rodando.');
            console.error('Erro de rede ou JSON:', error);
        }
    });
});
>>>>>>> bb50abb (Versão final)
