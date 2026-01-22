# Script de test de l'API EFSET

Write-Host "🧪 Test de l'API EFSET Backend" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"

# Test 1: Health Check
Write-Host "✅ Test 1: Health Check" -ForegroundColor Green
$response = curl.exe -s "$baseUrl/../health"
Write-Host $response
Write-Host ""

# Test 2: Inscription
Write-Host "✅ Test 2: Inscription d'un utilisateur" -ForegroundColor Green
$registerData = @{
    email = "test@example.com"
    password = "password123"
    full_name = "Test User"
} | ConvertTo-Json

$response = curl.exe -s -X POST "$baseUrl/auth/register" `
    -H "Content-Type: application/json" `
    -d $registerData

Write-Host $response
Write-Host ""

# Test 3: Connexion
Write-Host "✅ Test 3: Connexion" -ForegroundColor Green
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = curl.exe -s -X POST "$baseUrl/auth/login" `
    -H "Content-Type: application/json" `
    -d $loginData

$loginResponse = $response | ConvertFrom-Json
$token = $loginResponse.data.access_token

Write-Host "Token obtenu: $($token.Substring(0, 50))..." -ForegroundColor Yellow
Write-Host ""

# Test 4: Profil utilisateur
Write-Host "✅ Test 4: Récupération du profil" -ForegroundColor Green
$response = curl.exe -s "$baseUrl/auth/profile" `
    -H "Authorization: Bearer $token"

Write-Host $response
Write-Host ""

# Test 5: Récupérer questions Reading
Write-Host "✅ Test 5: Récupérer questions Reading (limit 5)" -ForegroundColor Green
$response = curl.exe -s "$baseUrl/questions?skill=reading&limit=5" `
    -H "Authorization: Bearer $token"

Write-Host $response
Write-Host ""

# Test 6: Statistiques Gemini (Admin)
Write-Host "✅ Test 6: Statistiques Gemini API" -ForegroundColor Green
$response = curl.exe -s "$baseUrl/admin/gemini-stats" `
    -H "Authorization: Bearer $token"

Write-Host $response
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Tests terminés !" -ForegroundColor Green
