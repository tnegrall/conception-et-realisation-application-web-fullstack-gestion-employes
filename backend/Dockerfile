FROM openjdk:11-jdk-slim

WORKDIR /app

# Copie du fichier pom.xml et téléchargement des dépendances
COPY pom.xml .
COPY src ./src

# Construction de l'application
RUN apt-get update && \
    apt-get install -y maven && \
    mvn clean package -DskipTests && \
    apt-get remove -y maven && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Copie du JAR généré
COPY target/*.jar app.jar

# Exposition du port
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "/app/app.jar"]