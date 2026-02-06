package com.example.employeemanagement.config;

import com.example.employeemanagement.model.Direction;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.model.JobTemplate;
import com.example.employeemanagement.model.Position;
import com.example.employeemanagement.model.Contract;
import com.example.employeemanagement.model.Skill;
import com.example.employeemanagement.model.Training;
import com.example.employeemanagement.model.Promotion;
import com.example.employeemanagement.model.PerformanceReview;
import com.example.employeemanagement.model.Document;
import com.example.employeemanagement.model.ServiceUnit;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.PositionRepository;
import com.example.employeemanagement.repository.ContractRepository;
import com.example.employeemanagement.repository.SkillRepository;
import com.example.employeemanagement.repository.TrainingRepository;
import com.example.employeemanagement.repository.PromotionRepository;
import com.example.employeemanagement.repository.PerformanceReviewRepository;
import com.example.employeemanagement.repository.DocumentRepository;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.repository.DirectionRepository;
import com.example.employeemanagement.repository.DivisionRepository;
import com.example.employeemanagement.repository.JobTemplateRepository;
import com.example.employeemanagement.repository.ServiceUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DirectionRepository directionRepository;

    @Autowired
    private ServiceUnitRepository serviceUnitRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private JobTemplateRepository jobTemplateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PerformanceReviewRepository performanceReviewRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (directionRepository.count() == 0) {
            System.out.println("Initializing DGI Organization Data...");

            // 1. Direction Générale
            Direction dg = new Direction();
            dg.setName("Direction Générale");
            dg.setDescription("Direction Générale des Impôts");
            dg.setMissions("Définir la stratégie fiscale et superviser l'ensemble des services.");
            dg.setObjectives("Optimiser les recettes fiscales et moderniser l'administration.");
            dg = directionRepository.save(dg);

            createJobTemplate("Directeur Général", "Responsable de l'ensemble de la DGI", dg, null, null);
            createJobTemplate("Assistant de Direction", "Assiste le DG dans ses tâches quotidiennes", dg, null, null);

            // Services de la DG
            createServiceWithDivisions(dg, "Service des Ressources Humaines", 
                "Gestion du personnel", 
                "Assurer la gestion administrative et le développement des compétences.",
                "Améliorer la performance et le bien-être des agents.",
                "Division Recrutement", "Division Formation", "Division Paie");
            
            createServiceWithDivisions(dg, "Service Informatique", 
                "Support et Développement", 
                "Maintenir le système d'information et développer de nouveaux outils.",
                "Garantir la disponibilité et la sécurité des données.",
                "Division Études et Développement", "Division Exploitation et Réseaux");

            // 2. Direction des Grandes Entreprises (DGE)
            Direction dge = new Direction();
            dge.setName("Direction des Grandes Entreprises");
            dge.setDescription("Gestion des contribuables à fort potentiel");
            dge.setMissions("Gérer les dossiers fiscaux des grandes entreprises.");
            dge.setObjectives("Assurer un recouvrement optimal et un service de qualité.");
            dge = directionRepository.save(dge);

            createJobTemplate("Directeur DGE", "Responsable de la DGE", dge, null, null);

            createServiceWithDivisions(dge, "Service de l'Assiette", 
                "Gestion de l'assiette fiscale", 
                "Calculer et vérifier les impôts dus.",
                "Fiabiliser l'assiette fiscale.",
                "Division Gestion des Dossiers", "Division Contrôle sur Pièces");
            
            createServiceWithDivisions(dge, "Service du Recouvrement", 
                "Recouvrement des impôts", 
                "Assurer le recouvrement des créances fiscales.",
                "Maximiser le taux de recouvrement.",
                "Division Poursuites", "Division Comptabilité");

            // 3. Direction Régionale I (Antananarivo)
            Direction dr1 = new Direction();
            dr1.setName("Direction Régionale Analamanga");
            dr1.setDescription("Direction opérationnelle régionale");
            dr1.setMissions("Mettre en œuvre la politique fiscale au niveau régional.");
            dr1.setObjectives("Atteindre les objectifs de recettes régionaux.");
            dr1 = directionRepository.save(dr1);

            createJobTemplate("Directeur Régional", "Responsable de la DR Analamanga", dr1, null, null);

            createServiceWithDivisions(dr1, "Service Régional des Entreprises", 
                "Gestion des PME/PMI", 
                "Gérer les dossiers des entreprises régionales.",
                "Assurer la conformité fiscale des PME.",
                "Division Immatriculation", "Division Gestion");

            System.out.println("DGI Organization Data Initialized.");
        }

        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@rh.local");
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
        }

        if (employeeRepository.count() == 0) {
            seedFakeEmployees();
        }
    }

    private void createServiceWithDivisions(Direction direction, String serviceName, String serviceDesc, String missions, String objectives, String... divisionNames) {
        ServiceUnit service = new ServiceUnit();
        service.setName(serviceName);
        service.setDescription(serviceDesc);
        service.setAddress("Adresse " + serviceName);
        service.setManagerName("Chef " + serviceName);
        service.setMissions(missions);
        service.setObjectives(objectives);
        service.setDirection(direction);
        service = serviceUnitRepository.save(service);

        createJobTemplate("Chef de Service " + serviceName, "Responsable du service", null, service, null);

        for (String divName : divisionNames) {
            Division division = new Division();
            division.setName(divName);
            division.setDescription("Division " + divName);
            division.setAddress("Adresse " + divName);
            division.setManagerName("Chef " + divName);
            division.setMissions("Missions de la " + divName);
            division.setObjectives("Objectifs de la " + divName);
            division.setServiceUnit(service);
            division = divisionRepository.save(division);
            
            createJobTemplate("Chef de Division " + divName, "Responsable de la division", null, null, division);
            createJobTemplate("Agent " + divName, "Agent opérationnel", null, null, division);
        }
    }

    private void createJobTemplate(String title, String description, Direction direction, ServiceUnit serviceUnit, Division division) {
        JobTemplate job = new JobTemplate();
        job.setTitle(title);
        job.setDescription(description);
        job.setDirection(direction);
        job.setServiceUnit(serviceUnit);
        job.setDivision(division);
        jobTemplateRepository.save(job);
    }

    private void seedFakeEmployees() {
        List<Division> divisions = divisionRepository.findAll();
        List<JobTemplate> jobTemplates = jobTemplateRepository.findAll();
        if (divisions.isEmpty()) {
            return;
        }

        String[] firstNames = {"Aina", "Miora", "Tojo", "Fara", "Hery", "Tahina", "Lala", "Nomena", "Toky", "Vola", "Mamy", "Mialy"};
        String[] lastNames = {"Rakoto", "Rabe", "Ranaivo", "Razafy", "Andriamanitra", "Rajaona", "Randria", "Ratsimba", "Rasolon", "Ravel"};
        String[] cities = {"Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa", "Antsiranana", "Toliara"};
        String[] countries = {"Madagascar"};
        String[] adminStatuses = {"Fonctionnaire", "Contractuel", "Stagiaire"};
        String[] statusCategories = {"A", "B", "C"};
        String[] diplomas = {"Licence", "Master", "Doctorat"};
        String[] skills = {"Excel", "Java", "SQL", "Gestion RH", "Communication", "Analyse"};
        String[] skillLevels = {"Débutant", "Intermédiaire", "Expert"};
        String[] contractTypes = {"CDI", "CDD", "STAGE"};
        String[] contractStatuses = {"ACTIF", "EXPIRÉ"};
        String[] reviewRatings = {"Bon", "Très bon", "Excellent"};

        Random random = new Random(42);

        for (int i = 1; i <= 60; i++) {
            Division division = divisions.get(random.nextInt(divisions.size()));
            ServiceUnit serviceUnit = division.getServiceUnit();
            Direction direction = serviceUnit != null ? serviceUnit.getDirection() : null;

            String firstName = firstNames[random.nextInt(firstNames.length)];
            String lastName = lastNames[random.nextInt(lastNames.length)];
            String email = String.format("%s.%s%02d@dgi.local", firstName.toLowerCase(), lastName.toLowerCase(), i);
            int age = 22 + random.nextInt(25);
            LocalDate dateOfBirth = LocalDate.now().minusYears(age).minusDays(random.nextInt(300));
            LocalDate hireDate = LocalDate.now().minusYears(random.nextInt(10)).minusMonths(random.nextInt(12)).minusDays(random.nextInt(28));
            LocalDateTime createdAt = LocalDateTime.now().minusMonths(random.nextInt(18)).minusDays(random.nextInt(28));

            JobTemplate template = jobTemplates.stream()
                .filter(t -> t.getDivision() != null && t.getDivision().getId().equals(division.getId()))
                .findAny()
                .orElse(jobTemplates.get(random.nextInt(jobTemplates.size())));

            Employee employee = new Employee();
            employee.setFirstName(firstName);
            employee.setLastName(lastName);
            employee.setEmail(email);
            employee.setGender(random.nextBoolean() ? "M" : "F");
            employee.setAge(age);
            employee.setDateOfBirth(dateOfBirth);
            employee.setSsn("123-45-" + String.format("%04d", 1000 + i));
            employee.setStreet("Lot " + (10 + i) + " Avenue DGI");
            employee.setZipCode("101");
            employee.setCity(cities[random.nextInt(cities.length)]);
            employee.setCountry(countries[0]);
            employee.setMobilePhone("034" + String.format("%07d", random.nextInt(10_000_000)));
            employee.setHomePhone("020" + String.format("%07d", random.nextInt(10_000_000)));
            employee.setEmergencyContact("032" + String.format("%07d", random.nextInt(10_000_000)));
            employee.setJobTitle(template.getTitle());
            employee.setJobTemplate(template);
            employee.setHireDate(hireDate);
            employee.setMatricule(String.format("EMP-%04d", i));
            employee.setAdministrativeStatus(adminStatuses[random.nextInt(adminStatuses.length)]);
            employee.setStatusCategory(statusCategories[random.nextInt(statusCategories.length)]);
            employee.setHighestDiploma(diplomas[random.nextInt(diplomas.length)]);
            employee.setCurrentAdministrativePosition("Niveau " + (1 + random.nextInt(4)));
            employee.setPublicServiceEntryDate(hireDate.minusYears(1));
            employee.setCurrentPostEntryDate(hireDate.plusMonths(6));
            employee.setPreviousPosition("Agent Junior");
            employee.setDirection(direction);
            employee.setServiceUnit(serviceUnit);
            employee.setDivision(division);
            employee.setCreatedAt(createdAt.atZone(ZoneId.systemDefault()).toInstant());
            employee.setUpdatedAt(createdAt.plusDays(random.nextInt(60)).atZone(ZoneId.systemDefault()).toInstant());

            Employee savedEmployee = employeeRepository.save(employee);

            Position position = new Position();
            position.setTitle(savedEmployee.getJobTitle());
            position.setDivision(division);
            position.setStatus("OCCUPIED");
            positionRepository.save(position);
            savedEmployee.setPosition(position);
            employeeRepository.save(savedEmployee);

            Contract contract = new Contract();
            contract.setEmployee(savedEmployee);
            contract.setType(contractTypes[random.nextInt(contractTypes.length)]);
            contract.setStartDate(hireDate);
            contract.setEndDate(contract.getType().equals("CDD") ? hireDate.plusYears(2) : null);
            contract.setProbationEndDate(hireDate.plusMonths(3));
            contract.setStatus(contractStatuses[random.nextInt(contractStatuses.length)]);
            contract.setGrade(statusCategories[random.nextInt(statusCategories.length)]);
            contract.setSalaryLevel("N" + (1 + random.nextInt(5)));
            contractRepository.save(contract);

            Skill skill = new Skill();
            skill.setEmployee(savedEmployee);
            skill.setName(skills[random.nextInt(skills.length)]);
            skill.setLevel(skillLevels[random.nextInt(skillLevels.length)]);
            skill.setCategory("TECHNIQUE");
            skillRepository.save(skill);

            Training training = new Training();
            training.setEmployee(savedEmployee);
            training.setName("Formation " + template.getTitle());
            training.setStartDate(hireDate.minusMonths(6));
            training.setDuration((2 + random.nextInt(4)) + " jours");
            training.setInstitution("Centre DGI");
            trainingRepository.save(training);

            if (random.nextBoolean()) {
                Promotion promotion = new Promotion();
                promotion.setEmployee(savedEmployee);
                promotion.setPromotionDate(hireDate.plusYears(1));
                promotion.setOldTitle("Agent Junior");
                promotion.setNewTitle(savedEmployee.getJobTitle());
                promotion.setReason("Performance remarquable");
                promotionRepository.save(promotion);
            }

            PerformanceReview review = new PerformanceReview();
            review.setEmployee(savedEmployee);
            review.setReviewDate(hireDate.plusMonths(9));
            review.setPeriod(String.valueOf(LocalDate.now().getYear()));
            review.setRating(reviewRatings[random.nextInt(reviewRatings.length)]);
            review.setObjectivesScore(70 + random.nextInt(30));
            review.setSkillsScore(70 + random.nextInt(30));
            review.setDisciplineScore(70 + random.nextInt(30));
            review.setProductivityScore(70 + random.nextInt(30));
            review.setFinalScore(3.5 + random.nextDouble());
            review.setRecommendation("Continuer les efforts");
            review.setComments("Évaluation automatique générée.");
            review.setReviewer("RH");
            review.setObjectivesAchieved("Objectifs atteints");
            review.setGeneralAppreciation("Bon niveau général");
            review.setStrengths("Rigueur, esprit d'équipe");
            review.setAreasForImprovement("Communication interne");
            review.setTrainingPlan("Formation avancée");
            performanceReviewRepository.save(review);

            Document document = new Document();
            document.setEmployee(savedEmployee);
            document.setTitle("Attestation de poste");
            document.setType("Attestation");
            document.setFilePath("/documents/attestation-" + savedEmployee.getMatricule() + ".pdf");
            document.setFileName("attestation-" + savedEmployee.getMatricule() + ".pdf");
            document.setContentType("application/pdf");
            documentRepository.save(document);
        }
    }
}
