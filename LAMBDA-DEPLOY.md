# 🚀 Guia de Deploy Lambda - API de Usuários

## ❌ Problema: "Cannot find module 'index'"

Este erro acontece quando o Lambda não encontra o arquivo handler. Siga os passos abaixo:

## ✅ Solução Passo a Passo

### 1️⃣ **Empacotar o Lambda**

#### **Opção A: Windows PowerShell**
```powershell
.\package-lambda.ps1
```

#### **Opção B: Manualmente**
1. Crie uma pasta `lambda-package`
2. Copie os arquivos:
   - `index.js` → `lambda-package/index.js`
   - `dist/` → `lambda-package/dist/`
   - `src/mocks/` → `lambda-package/src/mocks/`
3. Compacte tudo em ZIP (a pasta `lambda-package`, não seus arquivos)
4. Renomeie para `lambda-function.zip`

**Estrutura do ZIP deve ser:**
```
lambda-function.zip
├── index.js          ← DEVE estar na raiz!
├── dist/
│   └── users.js
└── src/
    └── mocks/
        └── users.js
```

### 2️⃣ **Configurar o Lambda**

1. **Faça upload do ZIP:**
   - No console Lambda → "Upload from" → ".zip file"
   - Selecione `lambda-function.zip`

2. **Configure o Handler:**
   ```
   Handler: index.handler
   ```
   ⚠️ **IMPORTANTE:** 
   - Use ponto (`.`) não barra (`/`)
   - Formato: `arquivo.funcao`
   - NÃO use: `index.handler.js` ou `/index.handler`

3. **Configure o Runtime:**
   ```
   Runtime: Node.js 22.x
   ```

4. **Timeout:**
   ```
   Timeout: 30 segundos (recomendado)
   ```

### 3️⃣ **Verificar se Funcionou**

Nos CloudWatch Logs, você deve ver:
```
Inicializando usuários mock: 3
Usuário adicionado: Rafael
Usuário adicionado: Eduardo
Usuário adicionado: Charlie Brown
```

Se aparecer `Cannot find module`, verifique:
- ✅ O arquivo `index.js` está na **raiz** do ZIP?
- ✅ O handler está configurado como `index.handler` (com ponto)?
- ✅ O runtime é Node.js 22.x?
- ✅ Todos os arquivos (`dist/users.js` e `src/mocks/users.js`) estão no ZIP?

## 🔍 Checklist de Troubleshooting

- [ ] Handler configurado como `index.handler` (não `index.handler.js`)
- [ ] Arquivo `index.js` na raiz do ZIP (não dentro de uma pasta)
- [ ] `dist/users.js` presente no ZIP
- [ ] `src/mocks/users.js` presente no ZIP
- [ ] Runtime: Node.js 22.x
- [ ] ZIP foi feito corretamente (estrutura de pastas preservada)

## 📝 Teste Depois do Deploy

**GET /users:**
```bash
curl https://seu-api-gateway-url/users
```

**Resposta esperada:**
```json
{
  "success": true,
  "count": 3,
  "users": [
    {
      "id": 1,
      "name": "Rafael",
      "email": "rafael@example.com"
    },
    {
      "id": 2,
      "name": "Eduardo",
      "email": "eduardo@example.com"
    },
    {
      "id": 3,
      "name": "Charlie Brown",
      "email": "charlie@example.com"
    }
  ]
}
```

