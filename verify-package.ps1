# Script para verificar a estrutura do pacote Lambda

Write-Host "🔍 Verificando estrutura do pacote..." -ForegroundColor Cyan
Write-Host ""

# Verificar se index.js existe na raiz
if (Test-Path "index.js") {
    Write-Host "✅ index.js encontrado na raiz" -ForegroundColor Green
} else {
    Write-Host "❌ index.js NÃO encontrado na raiz" -ForegroundColor Red
}

# Verificar se dist/users.js existe
if (Test-Path "dist\users.js") {
    Write-Host "✅ dist/users.js encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ dist/users.js NÃO encontrado" -ForegroundColor Red
}

# Verificar se src/mocks/users.js existe
if (Test-Path "src\mocks\users.js") {
    Write-Host "✅ src/mocks/users.js encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ src/mocks/users.js NÃO encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Conteúdo de index.js (primeiras 5 linhas):" -ForegroundColor Yellow
Get-Content "index.js" -TotalCount 5

Write-Host ""
Write-Host "📋 Verificando require paths no index.js:" -ForegroundColor Yellow
$content = Get-Content "index.js" -Raw
if ($content -match 'require\("\.\/dist\/users"\)') {
    Write-Host "✅ require('./dist/users') encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Verifique o path do require para dist/users" -ForegroundColor Yellow
}

if ($content -match 'require\("\.\/src\/mocks\/users"\)') {
    Write-Host "✅ require('./src/mocks/users') encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Verifique o path do require para src/mocks/users" -ForegroundColor Yellow
}

