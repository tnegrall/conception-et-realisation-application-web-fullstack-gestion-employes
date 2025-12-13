# Dockerfile optimisé pour Spring Boot avec fallbacks et retry
# Compatible avec environnements à accès réseau limité

# Stage 1: Build avec images alternatives
FROM maven:3.9-eclipse-temurin-11 AS build

# Fallback: Si eclipse-temurin échoue, utiliser openjdk
# FROM maven:3.9-openjdk-11 AS build

# Variables d'environnement pour Maven
ENV MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=512m -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.httpconnectionManager.ttlSeconds=120"

# Configuration pour proxy (décommentez si nécessaire)
# ENV HTTP_PROXY=http://proxy.example.com:8080
# ENV HTTPS_PROXY=http://proxy.example.com:8080
# ENV NO_PROXY=localhost,127.0.0.1

# Créer le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de configuration Maven d'abord (cache layer)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Télécharger les dépendances (avec retry)
# Cette étape est mise en cache si pom.xml ne change pas
RUN mvn dependency:go-offline -B || \
    (sleep 5 && mvn dependency:go-offline -B) || \
    (sleep 10 && mvn dependency:go-offline -B) || \
    echo "Warning: Some dependencies may not be cached"

# Copier le code source
COPY src ./src

# Build de l'application avec retry
RUN mvn clean package -DskipTests -B || \
    (sleep 5 && mvn clean package -DskipTests -B) || \
    (sleep 10 && mvn clean package -DskipTests -B)

# Stage 2: Runtime avec image légère
FROM eclipse-temurin:11-jre-jammy

# Fallback: Si eclipse-temurin échoue, utiliser openjdk
# FROM openjdk:11-jre-slim

# Créer un utilisateur non-root pour la sécurité
RUN groupadd -r spring && useradd -r -g spring spring

# Créer le répertoire de travail
WORKDIR /app

# Copier le JAR depuis le stage de build
COPY --from=build /app/target/*.jar app.jar

# Changer le propriétaire
RUN chown spring:spring app.jar

# Passer à l'utilisateur non-root
USER spring:spring

# Exposer le port
EXPOSE 8080

# Configuration JVM optimisée
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Installer wget pour healthcheck
USER root
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/* || \
    (apk update && apk add --no-cache wget) || \
    echo "wget installation skipped"
USER spring:spring

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Point d'entrée avec support des variables d'environnement
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
