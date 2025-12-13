#!/bin/bash

# Script de déploiement avec Docker Compose
# Usage: ./deploy.sh [start|stop|restart|logs|clean]

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ACTION=${1:-start}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier Docker Compose
check_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    # Utiliser docker compose (v2) ou docker-compose (v1)
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    log_info "Docker Compose détecté: $COMPOSE_CMD"
}

# Démarrer les services
start_services() {
    log_info "Démarrage des services..."
    
    # Build des images si nécessaire
    log_info "Construction des images..."
    $COMPOSE_CMD build --no-cache || log_warn "Certaines images peuvent déjà exister"
    
    # Démarrer les services
    log_info "Démarrage des conteneurs..."
    $COMPOSE_CMD up -d
    
    # Attendre que les services soient prêts
    log_info "Attente du démarrage des services..."
    sleep 10
    
    # Vérifier l'état
    $COMPOSE_CMD ps
    
    log_info "Services démarrés. Accès:"
    log_info "  - Frontend: http://localhost:3000"
    log_info "  - Backend:  http://localhost:8080"
    log_info "  - MySQL:    localhost:3306"
}

# Arrêter les services
stop_services() {
    log_info "Arrêt des services..."
    $COMPOSE_CMD down
    log_info "Services arrêtés"
}

# Redémarrer les services
restart_services() {
    log_info "Redémarrage des services..."
    stop_services
    sleep 5
    start_services
}

# Afficher les logs
show_logs() {
    log_info "Affichage des logs (Ctrl+C pour quitter)..."
    $COMPOSE_CMD logs -f
}

# Nettoyer
clean_all() {
    log_warn "Cette action va supprimer tous les conteneurs, volumes et images"
    read -p "Êtes-vous sûr ? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        log_info "Nettoyage en cours..."
        $COMPOSE_CMD down -v --rmi all
        log_info "Nettoyage terminé"
    else
        log_info "Opération annulée"
    fi
}

# Main
main() {
    check_compose
    
    case $ACTION in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            show_logs
            ;;
        clean)
            clean_all
            ;;
        *)
            log_error "Action invalide: $ACTION"
            log_info "Usage: ./deploy.sh [start|stop|restart|logs|clean]"
            exit 1
            ;;
    esac
}

main


