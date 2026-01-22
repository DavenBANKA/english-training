#!/bin/bash

echo "🧪 Test API EFSET"
echo "================="
echo ""

BASE_URL="http://localhost:3000/api"

# Test 1: Health Check
echo "✅ Test 1: Health Check"
curl -s http://localhost:3000/health | jq .
echo ""

# Test 2: Inscription
echo "✅ Test 2: Inscription"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}' | jq .
echo ""

# Test 3: Connexion
echo "✅ Test 3: Connexion"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

echo $RESPONSE | jq .

TOKEN=$(echo $RESPONSE | jq -r '.data.access_token')
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 4: Profil
echo "✅ Test 4: Profil"
curl -s "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 5: Questions Reading
echo "✅ Test 5: Questions Reading"
curl -s "$BASE_URL/questions?skill=reading&limit=3" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "================="
echo "✅ Tests terminés"
