/* eslint-disable @typescript-eslint/no-require-imports */
// Handler padrão para AWS Lambda integrado ao API Gateway

// Verificação de arquivos com tratamento de erro melhorado
let getUsers, addUser, mockUsers;

try {
  const usersModule = require("./dist/users");
  getUsers = usersModule.getUsers;
  addUser = usersModule.addUser;
  console.log("✅ dist/users.js carregado com sucesso");
} catch (error) {
  console.error("❌ Erro ao carregar dist/users.js:", error.message);
  throw new Error(`Não foi possível carregar dist/users.js: ${error.message}`);
}

try {
  mockUsers = require("./src/mocks/users");
  console.log("✅ src/mocks/users.js carregado com sucesso");
} catch (error) {
  console.error("❌ Erro ao carregar src/mocks/users.js:", error.message);
  throw new Error(`Não foi possível carregar src/mocks/users.js: ${error.message}`);
}

// Função para garantir que os dados mock estão inicializados
function initializeMockUsers() {
  const currentUsers = getUsers();
  if (currentUsers.length === 0) {
    console.log("Inicializando usuários mock:", mockUsers.length);
    mockUsers.forEach((user) => {
      addUser(user);
      console.log("Usuário adicionado:", user.name);
    });
  } else {
    console.log("Usuários já existem:", currentUsers.length);
  }
}

// Inicializa imediatamente quando o módulo é carregado
initializeMockUsers();

/**
 * Handler Lambda para API Gateway
 * @param {Object} event - Evento do API Gateway
 * @returns {Object} Resposta no formato do API Gateway
 */
exports.handler = async (event) => {
  console.log("Evento recebido:", JSON.stringify(event));

  // Headers CORS para permitir requisições do Insomnia e outros clientes
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Trata requisições OPTIONS (preflight CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Detecta o path da requisição (suporta diferentes formatos do API Gateway)
    const path = event.path || event.resource || event.pathParameters?.proxy || "";

    // Rota raiz - Informações da API
    if (event.httpMethod === "GET" && (path === "/" || path === "")) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "API de Usuários",
          version: "1.0.0",
          endpoints: {
            "GET /users": "Lista todos os usuários",
            "POST /users": "Adiciona um novo usuário (requer: name, email)",
          },
          example: {
            "GET": "https://seu-api-gateway.execute-api.regiao.amazonaws.com/stage/users",
            "POST": {
              url: "https://seu-api-gateway.execute-api.regiao.amazonaws.com/stage/users",
              body: { name: "João", email: "joao@example.com" },
            },
          },
        }),
      };
    }

    // GET /users - Lista todos os usuários
    if (event.httpMethod === "GET" && (path === "/users" || path.includes("/users"))) {
      // Garante que os dados mock estão inicializados (importante após cold start)
      initializeMockUsers();
      
      const users = getUsers();
      console.log("Usuários retornados:", users.length);
      console.log("Dados dos usuários:", JSON.stringify(users));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          count: users.length,
          users: users,
        }),
      };
    }

    // POST /users - Adiciona um novo usuário
    if (event.httpMethod === "POST" && (path === "/users" || path.includes("/users"))) {
      let body;
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Corpo da requisição inválido",
            details: parseError.message,
          }),
        };
      }

      // Valida se os campos obrigatórios estão presentes
      if (!body.name || !body.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: "Campos obrigatórios: name e email",
            required: ["name", "email"],
          }),
        };
      }

      // Gera ID automaticamente se não fornecido
      if (!body.id) {
        const users = getUsers();
        const maxId = users.length > 0 
          ? Math.max(...users.map(u => u.id || 0))
          : 0;
        body.id = maxId + 1;
      }

      addUser(body);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Usuário adicionado com sucesso!",
          data: body,
        }),
      };
    }

    // Rota não encontrada
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Rota não encontrada",
        method: event.httpMethod,
        path: path || "/",
        availableEndpoints: [
          "GET /",
          "GET /users",
          "POST /users",
        ],
      }),
    };
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Erro interno do servidor",
        details: error.message,
      }),
    };
  }
};

