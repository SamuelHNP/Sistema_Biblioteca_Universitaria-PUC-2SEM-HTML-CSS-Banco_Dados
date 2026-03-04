// ======================================================================
// URLs das APIs usadas no frontend
// ======================================================================

// URL da rota que retorna TODOS os empréstimos do sistema
const API_EMPRESTIMOS = "http://localhost:3000/api/gerenciar";

// URL da rota que retorna TODOS os livros cadastrados (mesmo sem estoque)
const API_LIVROS = "http://localhost:3000/api/livros";



// ======================================================================
// Função responsável por formatar datas vindas do backend
// ======================================================================
function formatarData(data) {
    // Se a data vier nula ou vazia, retorna um traço
    if (!data) return "—";

    // Converte a string em objeto Date
    const d = new Date(data);

    // Converte para formato brasileiro (dd/mm/yyyy)
    return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}



// ======================================================================
// TABELA 1 - CARREGAR EMPRÉSTIMOS
// Responsável por buscar todos os empréstimos e preencher a tabela
// ======================================================================
async function carregarEmprestimos() {

    // Obtém o corpo da tabela onde os dados serão inseridos
    const tabela = document.getElementById("tabela-corpo");

    // Mensagem inicial enquanto os dados estão carregando
    tabela.innerHTML = "<tr><td colspan='8'>Carregando...</td></tr>";

    try {
        // Faz a requisição GET ao backend para buscar os empréstimos
        const res = await fetch(API_EMPRESTIMOS);

        // Converte a resposta em JSON
        const dados = await res.json();

        // Caso o backend retorne erro (status diferente de 200)
        if (!res.ok) {
            tabela.innerHTML = `<tr><td colspan='8'>Erro ao carregar dados.</td></tr>`;
            return;
        }

        // Caso não exista nenhum empréstimo cadastrado
        if (!dados.length) {
            tabela.innerHTML = `<tr><td colspan='8'>Nenhum empréstimo encontrado.</td></tr>`;
            return;
        }

        // Reseta o conteúdo da tabela antes de preencher
        tabela.innerHTML = "";

        // Percorre todos os empréstimos recebidos
        dados.forEach(emp => {

            // Adiciona uma linha na tabela para cada empréstimo
            tabela.innerHTML += `
                <tr>
                    <td>${emp.id}</td>                                 
                    <td>${emp.aluno}</td>                              
                    <td>${emp.ra}</td>                                 
                    <td>${emp.livro}</td>                              
                    <td>${emp.status}</td>                             
                    <td>${formatarData(emp.data_retirada)}</td>        
                    <td>${emp.data_devolucao ? formatarData(emp.data_devolucao) : "—"}</td> 
                    <td>${emp.pontos}</td>                              
                </tr>
            `;
        });

    } catch (e) {
        // Caso ocorra erro de rede, servidor desligado, etc.
        tabela.innerHTML = `<tr><td colspan='8'>Erro no servidor.</td></tr>`;
        console.error(e);
    }
}



// ======================================================================
// TABELA 2 - CARREGAR TODOS OS LIVROS
// Faz a leitura da tabela completa de livros e popula a segunda tabela
// ======================================================================
async function carregarLivros() {

    // Obtém o corpo da tabela de livros
    const tabela = document.getElementById("tabela-livros-corpo");

    // Mensagem inicial enquanto carrega
    tabela.innerHTML = "<tr><td colspan='7'>Carregando...</td></tr>";

    try {
        // Requisição GET para buscar todos os livros cadastrados
        const res = await fetch(API_LIVROS);

        // Converte para JSON
        const livros = await res.json();

        // Caso o backend retorne erro
        if (!res.ok) {
            tabela.innerHTML = `<tr><td colspan='7'>Erro ao carregar livros.</td></tr>`;
            return;
        }

        // Caso não haja nenhum livro na base
        if (!livros.length) {
            tabela.innerHTML = `<tr><td colspan='7'>Nenhum livro encontrado.</td></tr>`;
            return;
        }

        // Limpa a tabela antes de preencher
        tabela.innerHTML = "";

        // Percorre cada livro da lista
        livros.forEach(livro => {

            // Monta a linha com os dados do livro
            tabela.innerHTML += `
                <tr>
                    <td>${livro.codigo}</td>          
                    <td>${livro.titulo}</td>          
                    <td>${livro.editora}</td>         
                    <td>${livro.autor}</td>           
                    <td>${livro.ano}</td>             
                    <td>${livro.total_copias}</td>    
                    <td>${livro.disponivel}</td>      
                </tr>
            `;
        });

    } catch (e) {
        // Caso ocorra erro de conexão
        tabela.innerHTML = `<tr><td colspan='7'>Erro no servidor.</td></tr>`;
        console.error(e);
    }
}

// ======================================================================
// EXECUTA AS DUAS FUNÇÕES QUANDO A PÁGINA TERMINA DE CARREGAR
// ======================================================================
window.onload = () => {
    carregarEmprestimos();  // Carrega a tabela de empréstimos
    carregarLivros();       // Carrega a tabela de livros
};
