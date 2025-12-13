FROM eclipse-temurin:11-jdk

WORKDIR /app

# Copie des fichiers Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Rendre le wrapper Maven exécutable
RUN chmod +x mvnw

# Téléchargement des dépendances
RUN ./mvnw dependency:go-offline -B

# Copie du code source
COPY src src

# Construction du projet
RUN ./mvnw package -DskipTests

# Exposition du port
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "target/*.jar"]