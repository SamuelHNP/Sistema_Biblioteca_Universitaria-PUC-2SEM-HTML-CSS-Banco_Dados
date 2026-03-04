// é responsável por criar e gerenciar o servidor web.
const express = require('express');

// Importa o CORS — um mecanismo que permite que o front-end (em outro domínio ou porta)
const cors = require('cors'); 

// Importa a função "connectDB" que você criou no arquivo database.js.
// Essa função é responsável por abrir a conexão com o banco de dados MySQL.
const { connectDB } = require('./database'); 

// Importa os arquivos de rotas. Cada um deles contém as requisições
// e respostas relacionadas a um tipo de dado (aluno, livro, etc.).
const alunoRoutes = require('./routes/aluno.routes');
const livroRoutes = require('./routes/livro.routes');

<<<<<<< HEAD
=======
const retiradaRoutes = require("./routes/retirada.routes");
const devolucaoRoutes = require("./routes/devolucao.routes");

const pontuacaoRoutes = require("./routes/pontuacao.routes");

const gerenciarRoutes = require("./routes/gerenciar_emprestimos");


>>>>>>> bb50abb (Versão final)
// Cria uma instância do servidor Express. A variável "servidor" é a base do seu back-end.
const servidor = express();

// Define a porta que o servidor vai usar (3000). 
// Você acessará o servidor por: http://localhost:3000
const PORT = 3000;

// ======================= MIDDLEWARES =======================

// Middleware 1: Ativa o CORS, permitindo que o front-end (em outra origem) 
// acesse as rotas da API sem ser bloqueado.
servidor.use(cors()); 

// Middleware 2: Faz o servidor entender requisições com JSON no corpo (body).
// Sem isso, o servidor não conseguiria ler "req.body" enviado pelo front-end.
servidor.use(express.json());

// ======================= ROTAS =======================

// Rota simples de teste: se você acessar "http://localhost:3000/" no navegador,
// o servidor responderá com o texto "Servidor funcionando!".
// Serve apenas para verificar rapidamente se o servidor está online.
servidor.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Usa o conjunto de rotas relacionadas aos alunos.
// Isso significa que qualquer rota criada dentro de "aluno.routes.js"
// será acessível com o prefixo "/api".
servidor.use('/api', alunoRoutes); 

// Usa o conjunto de rotas relacionadas aos livros, também com prefixo "/api".
servidor.use('/api', livroRoutes);

<<<<<<< HEAD
=======
servidor.use("/api/retirada", retiradaRoutes);

servidor.use("/api/devolucao", devolucaoRoutes);

servidor.use("/api/pontuacao", pontuacaoRoutes);

servidor.use("/api/gerenciar", gerenciarRoutes);
>>>>>>> bb50abb (Versão final)
// ======================= INICIALIZAÇÃO DO SERVIDOR =======================

// Função assíncrona que inicializa o servidor.
// Ela primeiro tenta conectar ao banco e, se der certo, inicia o servidor na porta 3000.
async function startServer() {
  try {
    // 1️ - Tenta conectar ao banco MySQL chamando a função que você fez em database.js.
    // Se a conexão falhar, o "catch" será executado.
    await connectDB(); 

    // 2️ - Essas linhas foram removidas porque eram usadas apenas no Sequelize
    // (para criar tabelas automaticamente). Com MySQL direto, isso não é necessário.
    // await sequelize.sync({ alter: true }); 
    // console.log('Tabelas sincronizadas com o banco de dados.');

    // 3 - Agora que o banco está conectado, o servidor Express começa a escutar requisições.
    servidor.listen(PORT, () => {
      // Essa mensagem aparece no console quando o servidor está rodando.
      console.log(`Servidor de BACK-END rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    // Caso ocorra algum erro (como falha na conexão com o banco), ele é exibido aqui.
    console.error('Falha Crítica ao Iniciar o Servidor:', error);

    // Encerra o processo para evitar que o servidor fique ativo sem o banco de dados.
    process.exit(1); 
  }
}

// Chama a função para iniciar tudo.
// Essa linha é o ponto de partida real do servidor.
startServer();
