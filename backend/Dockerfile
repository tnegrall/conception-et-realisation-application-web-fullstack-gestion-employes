FROM eclipse-temurin:11-jdk

WORKDIR /app

# Copie du pom.xml
COPY pom.xml .

# Installation de Maven et compilation
RUN apt-get update && \
    apt-get install -y maven && \
    mvn dependency:go-offline -B && \
    apt-get clean

# Copie du code source
COPY src ./src

# Construction du projet
RUN mvn package -DskipTests

# Exposition du port
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "target/*.jar"]