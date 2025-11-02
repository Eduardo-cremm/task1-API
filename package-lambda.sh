#!/bin/bash
# Script para empacotar o Lambda corretamente

echo "📦 Empacotando Lambda function..."

# Criar diretório temporário
mkdir -p lambda-package
cd lambda-package

# Copiar arquivos necessários
cp ../index.js .
cp -r ../dist .
cp -r ../src/mocks .

# Criar ZIP
zip -r ../lambda-function.zip . -x "*.git*" "*.DS_Store*"

# Voltar e limpar
cd ..
rm -rf lambda-package

echo "✅ Pacote criado: lambda-function.zip"
echo ""
echo "📋 Estrutura do pacote:"
unzip -l lambda-function.zip | grep -E "\.(js|json)$|/$" | head -20

echo ""
echo "🚀 Próximos passos:"
echo "1. Faça upload do lambda-function.zip no Lambda"
echo "2. Configure Handler como: index.handler"
echo "3. Configure Runtime como: Node.js 22.x"

