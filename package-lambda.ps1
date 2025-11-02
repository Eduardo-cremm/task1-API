# Script PowerShell para empacotar o Lambda corretamente

Write-Host "📦 Empacotando Lambda function..." -ForegroundColor Cyan

# Criar diretório temporário
if (Test-Path "lambda-package") {
    Remove-Item -Recurse -Force "lambda-package"
}
New-Item -ItemType Directory -Path "lambda-package" | Out-Null

# Copiar arquivos necessários
Copy-Item "index.js" -Destination "lambda-package\"
Copy-Item -Recurse "dist" -Destination "lambda-package\"
New-Item -ItemType Directory -Path "lambda-package\src\mocks" | Out-Null
Copy-Item -Recurse "src\mocks\*" -Destination "lambda-package\src\mocks\"

# Criar ZIP
Compress-Archive -Path "lambda-package\*" -DestinationPath "lambda-function.zip" -Force

# Limpar
Remove-Item -Recurse -Force "lambda-package"

Write-Host "✅ Pacote criado: lambda-function.zip" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Conteúdo do pacote:" -ForegroundColor Yellow
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("$PWD\lambda-function.zip")
$zip.Entries | Where-Object { $_.Name -match '\.(js|json)$' -or $_.FullName -match '/$' } | Select-Object -First 20 FullName
$zip.Dispose()

Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Faça upload do lambda-function.zip no Lambda"
Write-Host "2. Configure Handler como: index.handler"
Write-Host "3. Configure Runtime como: Node.js 22.x"

