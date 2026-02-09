# Script de déploiement sur Fly.io
# Usage: .\deploy.ps1 [backend|frontend|all]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('backend', 'frontend', 'all')]
    [string]$Target = 'all'
)

function Deploy-Backend {
    Write-Host "🚀 Déploiement du Backend..." -ForegroundColor Cyan
    
    Push-Location backend
    
    # Vérifier si l'app existe
    $appExists = fly apps list | Select-String "english-training-api"
    
    if (-not $appExists) {
        Write-Host "📦 Création de l'application backend..." -ForegroundColor Yellow
        fly apps create english-training-api
        
        Write-Host "🔐 Configuration des secrets..." -ForegroundColor Yellow
        Write-Host "⚠️  Vous devez configurer les secrets manuellement:" -ForegroundColor Red
        Write-Host "fly secrets set SUPABASE_URL='your_url' -a english-training-api"
        Write-Host "fly secrets set SUPABASE_ANON_KEY='your_key' -a english-training-api"
        Write-Host "fly secrets set SUPABASE_SERVICE_ROLE_KEY='your_key' -a english-training-api"
        Write-Host "fly secrets set GEMINI_API_KEYS='key1,key2,key3' -a english-training-api"
        Write-Host ""
        $continue = Read-Host "Avez-vous configuré les secrets? (o/n)"
        if ($continue -ne 'o') {
            Write-Host "❌ Déploiement annulé" -ForegroundColor Red
            Pop-Location
            return
        }
    }
    
    Write-Host "📤 Déploiement en cours..." -ForegroundColor Green
    fly deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend déployé avec succès!" -ForegroundColor Green
        Write-Host "🌐 URL: https://english-training-api.fly.dev" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erreur lors du déploiement du backend" -ForegroundColor Red
    }
    
    Pop-Location
}

function Deploy-Frontend {
    Write-Host "🚀 Déploiement du Frontend..." -ForegroundColor Cyan
    
    Push-Location frontend
    
    # Vérifier si l'app existe
    $appExists = fly apps list | Select-String "english-training-web"
    
    if (-not $appExists) {
        Write-Host "📦 Création de l'application frontend..." -ForegroundColor Yellow
        fly apps create english-training-web
    }
    
    Write-Host "📤 Déploiement en cours..." -ForegroundColor Green
    fly deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend déployé avec succès!" -ForegroundColor Green
        Write-Host "🌐 URL: https://english-training-web.fly.dev" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erreur lors du déploiement du frontend" -ForegroundColor Red
    }
    
    Pop-Location
}

# Vérifier que Fly CLI est installé
$flyInstalled = Get-Command fly -ErrorAction SilentlyContinue

if (-not $flyInstalled) {
    Write-Host "❌ Fly CLI n'est pas installé!" -ForegroundColor Red
    Write-Host "📥 Installation: iwr https://fly.io/install.ps1 -useb | iex" -ForegroundColor Yellow
    exit 1
}

# Vérifier l'authentification
$authStatus = fly auth whoami 2>&1

if ($authStatus -match "not logged in") {
    Write-Host "❌ Vous n'êtes pas connecté à Fly.io!" -ForegroundColor Red
    Write-Host "🔑 Connexion: fly auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "👤 Connecté en tant que: $authStatus" -ForegroundColor Green
Write-Host ""

# Déploiement selon la cible
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
Write-Host "🎉 Déploiement terminé!" -ForegroundColor Green
