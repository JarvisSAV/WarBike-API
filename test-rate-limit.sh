#!/bin/bash

# Script de prueba de Rate Limiting - WarBike API
# Ejecutar: chmod +x test-rate-limit.sh && ./test-rate-limit.sh

API_URL="http://localhost:3000"
COLORS=true

# Colores
if [ "$COLORS" = true ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  NC='\033[0m' # No Color
else
  RED=''
  GREEN=''
  YELLOW=''
  BLUE=''
  NC=''
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Rate Limiting Test - WarBike API${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 1. Estado inicial
echo -e "${YELLOW}📊 1. Estado inicial del rate limit${NC}"
curl -s "$API_URL/api/rate-limit-status" | jq '.rateLimits'
echo ""

# 2. Probar límite de signin
echo -e "${YELLOW}🔐 2. Probando límite de signin (5 intentos)${NC}"
for i in {1..6}; do
  response=$(curl -s -X POST "$API_URL/api/signin" \
    -H "Content-Type: application/json" \
    -d '{"email":"attacker@evil.com","password":"wrong"}')
  
  error=$(echo "$response" | jq -r '.error // empty')
  message=$(echo "$response" | jq -r '.message // empty')
  
  if [ -n "$error" ]; then
    echo -e "  Intento $i: ${RED}✗ $error${NC}"
  else
    echo -e "  Intento $i: ${GREEN}✓ $message${NC}"
  fi
done
echo ""

# 3. Verificar que el rate limit está activo
echo -e "${YELLOW}⏰ 3. Verificando rate limit activo${NC}"
response=$(curl -s -X POST "$API_URL/api/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"attacker@evil.com","password":"wrong"}')

retryAfter=$(echo "$response" | jq -r '.retryAfter // empty')
if [ -n "$retryAfter" ]; then
  minutes=$((retryAfter / 60))
  echo -e "  ${RED}✗ Rate limit activo. Reintentar en $minutes minutos${NC}"
else
  echo -e "  ${GREEN}✓ Sin rate limit activo${NC}"
fi
echo ""

# 4. Probar límite de signup
echo -e "${YELLOW}📝 4. Probando límite de signup (3 registros)${NC}"
for i in {1..4}; do
  response=$(curl -s -X POST "$API_URL/api/signup" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"testuser$RANDOM@test.com\",\"password\":\"Test12345\",\"name\":\"Test User\"}")
  
  error=$(echo "$response" | jq -r '.error // empty')
  message=$(echo "$response" | jq -r '.message // empty')
  
  if [ -n "$error" ]; then
    echo -e "  Registro $i: ${RED}✗ $error${NC}"
  else
    echo -e "  Registro $i: ${GREEN}✓ $message${NC}"
  fi
done
echo ""

# 5. Probar rate limit por email específico
echo -e "${YELLOW}👤 5. Probando rate limit por email específico${NC}"
TARGET_EMAIL="targeted@user.com"
echo -e "  Email objetivo: ${BLUE}$TARGET_EMAIL${NC}"

for i in {1..6}; do
  response=$(curl -s -X POST "$API_URL/api/signin" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 10.0.0.$i" \
    -d "{\"email\":\"$TARGET_EMAIL\",\"password\":\"wrong\"}")
  
  error=$(echo "$response" | jq -r '.error // empty')
  
  if [ -n "$error" ]; then
    echo -e "  Intento $i (IP 10.0.0.$i): ${RED}✗ Bloqueado${NC}"
    break
  else
    echo -e "  Intento $i (IP 10.0.0.$i): ${GREEN}✓ Permitido${NC}"
  fi
done
echo ""

# 6. Estado final
echo -e "${YELLOW}📊 6. Estado final del rate limit${NC}"
curl -s "$API_URL/api/rate-limit-status" | jq '.rateLimits'
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Pruebas completadas${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
