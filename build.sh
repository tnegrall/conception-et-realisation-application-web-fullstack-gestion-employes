#!/bin/bash

# Script de build robuste avec retry logic
# Usage: ./build.sh [backend|frontend|all]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES=3
RETRY_DELAY=10
BUILD_TARGET=${1:-all}

# Fonction de log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction de retry
retry_command() {
    local cmd=$1
    local retries=0
    local result=1
    
    while [ $retries -lt $MAX_RETRIES ]; do
        log_info "Tentative $((retries + 1))/$MAX_RETRIES: $cmd"
        
        if eval "$cmd"; then
            result=0
            break
        else
            retries=$((retries + 1))
            if [ $retries -lt $MAX_RETRIES ]; then
                log_warn "Échec, nouvelle tentative dans ${RETRY_DELAY}s..."
                sleep $RETRY_DELAY
            fi
        fi
    done
    
    return $result
}

# Vérifier Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon n'est pas démarré"
        exit 1
    fi
    
    log_info "Docker est disponible"
}

# Build backend
build_backend() {
    log_info "Construction de l'image backend..."
    
    # Essayer d'abord avec eclipse-temurin
    if retry_command "docker build -t employee-backend:latest ./backend"; then
        log_info "Backend construit avec succès"
        return 0
    fi
    
    log_warn "Échec avec eclipse-temurin, tentative avec openjdk..."
    
    # Fallback: modifier temporairement le Dockerfile
    cd backend
    sed -i.bak 's/eclipse-temurin:11-jdk/openjdk:11-jdk/g' Dockerfile
    sed -i.bak 's/eclipse-temurin:11-jre-jammy/openjdk:11-jre-slim/g' Dockerfile
    
    if retry_command "docker build -t employee-backend:latest ."; then
        log_info "Backend construit avec succès (openjdk)"
        mv Dockerfile.bak Dockerfile
        cd ..
        return 0
    fi
    
    # Restaurer le fichier original
    mv Dockerfile.bak Dockerfile
    cd ..
    log_error "Échec de la construction du backend"
    return 1
}

# Build frontend
build_frontend() {
    log_info "Construction de l'image frontend..."
    
    # Essayer d'abord avec node:18-alpine
    if retry_command "docker build -t employee-frontend:latest ./frontend"; then
        log_info "Frontend construit avec succès"
        return 0
    fi
    
    log_warn "Échec avec node:18-alpine, tentative avec node:18..."
    
    # Fallback: modifier temporairement le Dockerfile
    cd frontend
    sed -i.bak 's/node:18-alpine/node:18/g' Dockerfile
    
    if retry_command "docker build -t employee-frontend:latest ."; then
        log_info "Frontend construit avec succès (node:18)"
        mv Dockerfile.bak Dockerfile
        cd ..
        return 0
    fi
    
    # Restaurer le fichier original
    mv Dockerfile.bak Dockerfile
    cd ..
    log_error "Échec de la construction du frontend"
    return 1
}

# Main
main() {
    log_info "Démarrage du build Docker..."
    
    check_docker
    
    case $BUILD_TARGET in
        backend)
            build_backend
            ;;
        frontend)
            build_frontend
            ;;
        all)
            build_backend
            build_frontend
            log_info "Toutes les images ont été construites avec succès"
            ;;
        *)
            log_error "Cible invalide: $BUILD_TARGET"
            log_info "Usage: ./build.sh [backend|frontend|all]"
            exit 1
            ;;
    esac
}

main

