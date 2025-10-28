// BACK-END/server.js (CORRIGIDO PARA MYSQL/MYSQL2)

// Importa bibliotecas essenciais
const express = require('express');
const cors = require('cors'); 

// ** AJUSTADO **: Importa apenas a função de conexão do seu database.js (que usa mysql2)
const { connectDB } = require('./database'); 

// ** REMOVIDO/COMENTADO **: Removidas as importações de Models, pois você não está usando Sequelize.
// const Aluno = require('./models/Aluno'); 
// const Livro = require('./models/Livro'); 

// Importa as Rotas (Arquivos que você irá criar e preencher com SQL)
const alunoRoutes = require('./routes/aluno.routes'); // <- Ponto no meio
const livroRoutes = require('./routes/livro.routes');

// Cria a instância do Express
const servidor = express();
const PORT = 3000;

// ======================= MIDDLEWARES =======================

servidor.use(cors()); 
servidor.use(express.json());

// ======================= ROTAS =======================

// Rota de teste
servidor.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rotas da API de Cadastro
servidor.use('/api', alunoRoutes); 
servidor.use('/api', livroRoutes);

// ======================= INICIALIZAÇÃO DO SERVIDOR =======================

async function startServer() {
  try {
    // 1. Tenta conectar ao banco de dados (função que você criou no database.js)
    await connectDB(); 

    // ** REMOVIDO **: Esta linha é exclusiva do Sequelize (ORM) e não deve ser usada.
    // await sequelize.sync({ alter: true }); 
    // console.log('Tabelas sincronizadas com o banco de dados.');

    // 2. Não há mais sincronização automática. Presume-se que as tabelas já existem no MySQL.
    
    // 3. Inicializa o servidor Express
    servidor.listen(PORT, () => {
      console.log(`Servidor de BACK-END rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Falha Crítica ao Iniciar o Servidor:', error);
    process.exit(1); 
  }
}

startServer();