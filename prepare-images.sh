#!/bin/bash

# Script pour préparer les images Docker de base
# À exécuter sur une machine avec accès internet
# Usage: ./prepare-images.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Liste des images nécessaires
IMAGES=(
    "eclipse-temurin:11-jdk"
    "eclipse-temurin:11-jre-jammy"
    "openjdk:11-jdk"
    "openjdk:11-jre-slim"
    "maven:3.9-eclipse-temurin-11"
    "maven:3.9-openjdk-11"
    "node:18-alpine"
    "node:18"
    "nginx:alpine"
    "nginx:latest"
    "mysql:8.0"
)

log_info "Téléchargement des images Docker..."

# Télécharger chaque image
for image in "${IMAGES[@]}"; do
    log_info "Téléchargement: $image"
    docker pull "$image" || log_warn "Échec pour $image"
done

# Sauvegarder toutes les images
log_info "Sauvegarde des images..."
docker save "${IMAGES[@]}" | gzip > docker-images-base.tar.gz

log_info "Images sauvegardées dans: docker-images-base.tar.gz"
log_info "Taille du fichier:"
ls -lh docker-images-base.tar.gz

log_info "Pour charger sur une autre machine:"
log_info "  docker load < docker-images-base.tar.gz"

