// Handler padrão para AWS Lambda integrado ao API Gateway
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { getUsers, addUser } = require('./dist/users.js');
const mockUsers = require('./src/mocks/users.js');

// Inicializa com usuários mock se o array estiver vazio
if (getUsers().length === 0) {
	mockUsers.forEach((user) => addUser(user));
}

/**
 * Handler Lambda para API Gateway
 * @param {Object} event - Evento do API Gateway
 * @returns {Object} Resposta no formato do API Gateway
 */
export const handler = async (event) => {
	console.log('Evento recebido:', JSON.stringify(event));

	// Headers CORS para permitir requisições do Insomnia e outros clientes
	const headers = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	};

	// Trata requisições OPTIONS (preflight CORS)
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers,
			body: '',
		};
	}

	try {
		// Detecta o path da requisição (suporta diferentes formatos do API Gateway)
		const path = event.path || event.resource || event.pathParameters?.proxy || '';

		// GET /users
		if (event.httpMethod === 'GET' && (path === '/users' || path.includes('/users'))) {
			const users = getUsers();
			return {
				statusCode: 200,
				headers,
				body: JSON.stringify({ users }),
			};
		}

		// POST /users
		if (event.httpMethod === 'POST' && (path === '/users' || path.includes('/users'))) {
			let body;
			try {
				body = event.body ? JSON.parse(event.body) : {};
			} catch (parseError) {
				return {
					statusCode: 400,
					headers,
					body: JSON.stringify({
						error: 'Corpo da requisição inválido',
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
						error: 'Campos obrigatórios: name e email',
					}),
				};
			}

			addUser(body);
			return {
				statusCode: 201,
				headers,
				body: JSON.stringify({
					message: 'Usuário adicionado!',
					data: body,
				}),
			};
		}

		// Rota não encontrada
		return {
			statusCode: 404,
			headers,
			body: JSON.stringify({
				error: `Rota não encontrada: ${event.httpMethod} ${path}`,
			}),
		};
	} catch (error) {
		console.error('Erro ao processar requisição:', error);
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				error: 'Erro interno do servidor',
				details: error.message,
			}),
		};
	}
};

