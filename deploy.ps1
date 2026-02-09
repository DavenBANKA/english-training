# Script de deploiement sur Fly.io
# Usage: .\deploy.ps1 [backend|frontend|all]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('backend', 'frontend', 'all')]
    [string]$Target = 'all'
)

function Deploy-Backend {
    Write-Host "Deploiement du Backend..." -ForegroundColor Cyan
    
    Push-Location backend
    
    # Verifier si l'app existe
    $appExists = fly apps list | Select-String "english-training-api"
    
    if (-not $appExists) {
        Write-Host "Creation de l'application backend..." -ForegroundColor Yellow
        fly apps create english-training-api
        
        Write-Host "Configuration des secrets..." -ForegroundColor Yellow
        Write-Host "Vous devez configurer les secrets manuellement:" -ForegroundColor Red
        Write-Host "fly secrets set SUPABASE_URL='your_url' -a english-training-api"
        Write-Host "fly secrets set SUPABASE_ANON_KEY='your_key' -a english-training-api"
        Write-Host "fly secrets set SUPABASE_SERVICE_ROLE_KEY='your_key' -a english-training-api"
        Write-Host "fly secrets set GEMINI_API_KEYS='key1,key2,key3' -a english-training-api"
        Write-Host ""
        $continue = Read-Host "Avez-vous configure les secrets? (o/n)"
        if ($continue -ne 'o') {
            Write-Host "Deploiement annule" -ForegroundColor Red
            Pop-Location
            return
        }
    }
    
    Write-Host "Deploiement en cours..." -ForegroundColor Green
    fly deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend deploye avec succes!" -ForegroundColor Green
        Write-Host "URL: https://english-training-api.fly.dev" -ForegroundColor Cyan
    } else {
        Write-Host "Erreur lors du deploiement du backend" -ForegroundColor Red
    }
    
    Pop-Location
}

function Deploy-Frontend {
    Write-Host "Deploiement du Frontend..." -ForegroundColor Cyan
    
    Push-Location frontend
    
    # Verifier si l'app existe
    $appExists = fly apps list | Select-String "english-training-web"
    
    if (-not $appExists) {
        Write-Host "Creation de l'application frontend..." -ForegroundColor Yellow
        fly apps create english-training-web
    }
    
    Write-Host "Deploiement en cours..." -ForegroundColor Green
    fly deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Frontend deploye avec succes!" -ForegroundColor Green
        Write-Host "URL: https://english-training-web.fly.dev" -ForegroundColor Cyan
    } else {
        Write-Host "Erreur lors du deploiement du frontend" -ForegroundColor Red
    }
    
    Pop-Location
}

# Verifier que Fly CLI est installe
$flyInstalled = Get-Command fly -ErrorAction SilentlyContinue

if (-not $flyInstalled) {
    Write-Host "Fly CLI n'est pas installe!" -ForegroundColor Red
    Write-Host "Installation: iwr https://fly.io/install.ps1 -useb | iex" -ForegroundColor Yellow
    exit 1
}

# Verifier l'authentification
$authStatus = fly auth whoami 2>&1

if ($authStatus -match "not logged in") {
    Write-Host "Vous n'etes pas connecte a Fly.io!" -ForegroundColor Red
    Write-Host "Connexion: fly auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Connecte en tant que: $authStatus" -ForegroundColor Green
Write-Host ""

# Deploiement selon la cible
switch ($Target) {
    'backend' {
        Deploy-Backend
    }
    'frontend' {
        Deploy-Frontend
    }
    'all' {
        Deploy-Backend
        Write-Host ""
        Deploy-Frontend
    }
}

Write-Host ""
Write-Host "Deploiement termine!" -ForegroundColor Green
