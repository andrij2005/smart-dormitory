-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: dormitory
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `benefits`
--

DROP TABLE IF EXISTS `benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benefits` (
  `benefit_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `discount_percent` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`benefit_id`),
  CONSTRAINT `benefits_chk_1` CHECK (((`discount_percent` >= 0) and (`discount_percent` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `benefits`
--

LOCK TABLES `benefits` WRITE;
/*!40000 ALTER TABLE `benefits` DISABLE KEYS */;
INSERT INTO `benefits` VALUES (1,'Без пільг',0,'Студенти на загальних підставах',1),(2,'Сирота',100,'Повне звільнення від оплати за проживання',1),(3,'ВПО',50,'Внутрішньо переміщена особа',1),(4,'УБД (Діти)',50,'Діти учасників бойових дій',1),(5,'Інвалідність I групи',100,'Звільнення від оплати за станом здоров\'я',1),(6,'Інвалідність II групи',50,'Часткова пільга за станом здоров\'я',1),(7,'Багатодітна сім\'я',30,'Знижка 30% для дітей з багатодітних сімей',1),(8,'Малозабезпечені',40,'Державна підтримка',1),(9,'Чорнобилець',100,'Постраждалі внаслідок аварії на ЧАЕС',1),(10,'Відмінник',10,'Знижка за високі досягнення у навчанні',1),(11,'Без пільг',0,'Студенти на загальних підставах',1),(12,'Сирота',100,'Повне звільнення від оплати за проживання',1),(13,'ВПО',50,'Внутрішньо переміщена особа',1),(14,'УБД (Діти)',50,'Діти учасників бойових дій',1),(15,'Інвалідність I групи',100,'Звільнення від оплати за станом здоров\'я',1),(16,'Інвалідність II групи',50,'Часткова пільга за станом здоров\'я',1),(17,'Багатодітна сім\'я',30,'Знижка 30% для дітей з багатодітних сімей',1),(18,'Малозабезпечені',40,'Державна підтримка',1),(19,'Чорнобилець',100,'Постраждалі внаслідок аварії на ЧАЕС',1),(20,'Відмінник',10,'Знижка за високі досягнення у навчанні',1);
/*!40000 ALTER TABLE `benefits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finances`
--

DROP TABLE IF EXISTS `finances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finances` (
  `finance_id` int NOT NULL AUTO_INCREMENT,
  `charge_type` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  `date_issued` date NOT NULL,
  `date_paid` date DEFAULT NULL,
  `student_id` int NOT NULL,
  PRIMARY KEY (`finance_id`),
  KEY `student_id` (`student_id`),
  KEY `idx_finances_is_paid` (`is_paid`),
  CONSTRAINT `finances_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finances`
--

LOCK TABLES `finances` WRITE;
/*!40000 ALTER TABLE `finances` DISABLE KEYS */;
INSERT INTO `finances` VALUES (1,'оплата за проживання грудень',0.00,1,'2026-05-24','2026-05-24',9),(2,'оплата за проживання грудень',0.00,1,'2026-05-24','2026-05-24',1),(3,'оплата за проживання грудень',99.00,0,'2026-05-24',NULL,10),(4,'we',0.00,1,'2026-05-24','2026-05-24',5),(5,'2',0.00,1,'2026-05-24','2026-05-24',5),(6,'2',0.00,1,'2026-05-24','2026-05-24',5),(7,'2',2.00,0,'2026-05-25',NULL,12),(8,'2',0.00,1,'2026-05-25','2026-05-25',12),(9,'3',0.00,1,'2026-05-25','2026-05-25',12),(10,'3',0.50,0,'2026-05-25',NULL,8),(11,'2',2.00,0,'2026-05-25',NULL,8);
/*!40000 ALTER TABLE `finances` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_finance_update` BEFORE UPDATE ON `finances` FOR EACH ROW BEGIN
    IF NEW.is_paid = TRUE AND OLD.is_paid = FALSE AND NEW.date_paid IS NULL THEN
        SET NEW.date_paid = CURDATE();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `incidents`
--

DROP TABLE IF EXISTS `incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidents` (
  `incident_id` int NOT NULL AUTO_INCREMENT,
  `incident_date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `repair_status` varchar(50) DEFAULT 'Очікує',
  `fault_type` varchar(50) DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  PRIMARY KEY (`incident_id`),
  KEY `room_id` (`room_id`),
  KEY `student_id` (`student_id`),
  KEY `idx_incidents_status` (`repair_status`),
  CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidents`
--

LOCK TABLES `incidents` WRITE;
/*!40000 ALTER TABLE `incidents` DISABLE KEYS */;
/*!40000 ALTER TABLE `incidents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  `condition_status` varchar(50) DEFAULT 'Новий',
  `last_check_date` date DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_accommodation_history`
--

DROP TABLE IF EXISTS `report_accommodation_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_accommodation_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `room_id` int DEFAULT NULL,
  `move_in_date` date NOT NULL,
  `move_out_date` date DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `fk_history_student` (`student_id`),
  KEY `fk_history_room` (`room_id`),
  CONSTRAINT `fk_history_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_history_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_accommodation_history`
--

LOCK TABLES `report_accommodation_history` WRITE;
/*!40000 ALTER TABLE `report_accommodation_history` DISABLE KEYS */;
INSERT INTO `report_accommodation_history` VALUES (1,6,NULL,'2026-05-23','2026-05-23'),(2,8,NULL,'2026-05-24','2026-05-24'),(3,9,NULL,'2026-05-24','2026-05-24'),(4,10,NULL,'2026-05-24','2026-05-24'),(5,5,NULL,'2026-05-24','2026-05-24'),(6,6,NULL,'2026-05-24','2026-05-25'),(7,8,NULL,'2026-05-24','2026-05-25'),(8,11,NULL,'2026-05-24','2026-05-25'),(9,10,NULL,'2026-05-24','2026-05-24'),(10,5,NULL,'2026-05-24','2026-05-25'),(11,10,NULL,'2026-05-24','2026-05-25'),(12,12,NULL,'2026-05-25','2026-05-25'),(13,12,NULL,'2026-05-25','2026-05-25'),(14,12,NULL,'2026-05-25','2026-05-25');
/*!40000 ALTER TABLE `report_accommodation_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_payments`
--

DROP TABLE IF EXISTS `report_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `finance_id` int NOT NULL,
  `student_id` int NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_finance` (`finance_id`),
  KEY `fk_payment_student` (`student_id`),
  CONSTRAINT `fk_payment_finance` FOREIGN KEY (`finance_id`) REFERENCES `finances` (`finance_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_payments`
--

LOCK TABLES `report_payments` WRITE;
/*!40000 ALTER TABLE `report_payments` DISABLE KEYS */;
INSERT INTO `report_payments` VALUES (1,1,9,909.00,'2026-05-24 13:36:25'),(2,2,1,99.00,'2026-05-24 13:38:07'),(3,1,9,90.00,'2026-05-24 13:44:21'),(4,3,10,900.00,'2026-05-24 15:48:55'),(5,3,10,994.00,'2026-05-24 19:24:51'),(6,4,5,2.00,'2026-05-24 19:25:45'),(7,5,5,2.00,'2026-05-24 20:07:08'),(8,6,5,2.00,'2026-05-24 20:26:41'),(9,3,10,900.00,'2026-05-25 00:12:56'),(10,8,12,2.00,'2026-05-25 11:31:00'),(11,9,12,0.50,'2026-05-25 11:31:08'),(12,11,8,18.00,'2026-05-25 12:24:02');
/*!40000 ALTER TABLE `report_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_number` varchar(10) NOT NULL,
  `floor` int NOT NULL,
  `block_name` varchar(10) DEFAULT NULL,
  `capacity` int NOT NULL,
  `current_occupancy` int DEFAULT '0',
  `apartment_number` varchar(20) DEFAULT NULL,
  `wing_type` varchar(20) DEFAULT 'Не вказано',
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_number` (`room_number`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'201',2,NULL,2,2,'1','Жіноче'),(2,'202',2,NULL,3,2,'1','Жіноче'),(3,'203',2,NULL,4,3,'2','Жіноче'),(4,'204',2,NULL,2,0,'2','Жіноче'),(5,'301',3,NULL,2,1,'3','Жіноче'),(6,'302',3,NULL,4,2,'3','Жіноче'),(7,'303',3,NULL,4,1,'4','Жіноче'),(8,'401',4,NULL,2,2,'5','Чоловіче'),(9,'402',4,NULL,3,2,'5','Чоловіче'),(10,'403',4,NULL,4,3,'6','Чоловіче'),(11,'404',4,NULL,3,1,'6','Чоловіче'),(12,'501',5,NULL,2,1,'7','Чоловіче'),(13,'502',5,NULL,4,1,'7','Чоловіче'),(14,'503',5,NULL,4,2,'8','Чоловіче'),(15,'504',5,NULL,2,0,'8','Чоловіче');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_room_delete` BEFORE DELETE ON `rooms` FOR EACH ROW BEGIN
    IF OLD.current_occupancy > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Помилка: Не можна видалити кімнату, де живуть студенти!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `student_inventory`
--

DROP TABLE IF EXISTS `student_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_inventory` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `issue_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  KEY `student_id` (`student_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `student_inventory_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `student_inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `inventory` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_inventory`
--

LOCK TABLES `student_inventory` WRITE;
/*!40000 ALTER TABLE `student_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `benefit_id` int DEFAULT NULL,
  `gender` varchar(20) DEFAULT 'Не вказано',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  KEY `room_id` (`room_id`),
  KEY `benefit_id` (`benefit_id`),
  KEY `idx_students_last_name` (`last_name`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE SET NULL,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`benefit_id`) REFERENCES `benefits` (`benefit_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Святослав','Лампов','+38054578864','lampowswit@email.com',NULL,1,'Чоловіча',0),(3,'Святослав','Кураса','+380546475678','kurs56hyho7@email.com',NULL,1,'Чоловіча',1),(4,'Сергій','Ромивський','+38075867888','rmuckujesfgf54@gmail.com',NULL,1,'Чоловіча',1),(5,'Роман','Луков','+3807876324','lukowroman43534fsf@gmail.com',NULL,3,'Чоловіча',0),(6,'Галина','Лукова','+380745687','lukow_galuna435678@gmail.com',NULL,5,'Жіноча',0),(8,'Галинаа','Луковаа','+380763556687','lukow_galuna434525678@gmail.com',NULL,10,'Жіноча',0),(9,'Микита','Бакланов','+380386592','mukutabklanow@gamil.com',NULL,7,'Чоловіча',0),(10,'Роман','Поляк','+38058854439','poliakroman@gmail.com',NULL,11,'Чоловіча',0),(11,'марина','Синіцина','+38059685864','sunucinamarina873t@gmail.com',NULL,17,'Жіноча',0),(12,'Рома','Луковий','+380787557','lukowroma43534fsf@gmail.com',NULL,1,'Чоловіча',0),(13,'Олена','Коваленко','+380501112233','olena.k@email.com',1,NULL,'Жіноча',1),(14,'Марія','Шевченко','+380671112233','maria.sh@email.com',1,1,'Жіноча',1),(15,'Ірина','Бойко','+380931112233','ira.b@email.com',2,NULL,'Жіноча',1),(16,'Анна','Мельник','+380631112233','anna.m@email.com',2,NULL,'Жіноча',1),(17,'Катерина','Ткаченко','+380991112233','katya.t@email.com',3,2,'Жіноча',1),(18,'Дарія','Кравченко','+380681112233','dasha.k@email.com',3,NULL,'Жіноча',1),(19,'Вікторія','Олійник','+380731112233','vika.o@email.com',3,NULL,'Жіноча',1),(20,'Софія','Поліщук','+380502223344','sofi.p@email.com',5,NULL,'Жіноча',1),(21,'Юлія','Лисенко','+380672223344','yulia.l@email.com',6,NULL,'Жіноча',1),(22,'Наталія','Марченко','+380932223344','nata.m@email.com',6,NULL,'Жіноча',1),(23,'Анастасія','Рудницька','+380504445566','nastia.r@email.com',7,NULL,'Жіноча',1),(24,'Олександр','Петренко','+380993334455','sasha.p@email.com',8,NULL,'Чоловіча',1),(25,'Максим','Іванов','+380683334455','max.i@email.com',8,NULL,'Чоловіча',1),(26,'Дмитро','Сидоренко','+380733334455','dima.s@email.com',9,3,'Чоловіча',1),(27,'Артем','Григоренко','+380509998877','artem.g@email.com',9,NULL,'Чоловіча',1),(28,'Денис','Козловський','+380679998877','denis.k@email.com',10,NULL,'Чоловіча',1),(29,'Андрій','Мороз','+380939998877','andriy.m@email.com',10,NULL,'Чоловіча',1),(30,'Владислав','Павленко','+380998887766','vlad.p@email.com',10,NULL,'Чоловіча',1),(31,'Ігор','Савченко','+380688887766','igor.s@email.com',11,NULL,'Чоловіча',1),(32,'Богдан','Литвин','+380738887766','bogdan.l@email.com',12,NULL,'Чоловіча',1),(33,'Тарас','Кузьменко','+380507776655','taras.k@email.com',13,NULL,'Чоловіча',1),(34,'Роман','Романенко','+380677776655','roman.r@email.com',14,NULL,'Чоловіча',1),(35,'Михайло','Гаврилюк','+380937776655','misha.g@email.com',14,NULL,'Чоловіча',1),(36,'Василь','Стус','+380991234567','vasyl.s@email.com',NULL,NULL,'Чоловіча',1),(37,'Олег','Скрипка','+380681234567','oleg.s@email.com',NULL,NULL,'Чоловіча',1),(38,'Світлана','Лобода','+380731234567','sveta.l@email.com',NULL,NULL,'Жіноча',1),(39,'Тіна','Кароль','+380501234567','tina.k@email.com',NULL,NULL,'Жіноча',1),(40,'Сергій','Жадан','+380671234567','serg.zh@email.com',NULL,NULL,'Чоловіча',1),(41,'Оксана','Забужко','+380931234567','oksana.z@email.com',NULL,NULL,'Жіноча',1),(42,'Павло','Зібров','+380991122334','pavlo.z@email.com',NULL,NULL,'Чоловіча',1),(43,'Надія','Мейхер','+380681122334','nadia.m@email.com',NULL,NULL,'Жіноча',1),(44,'Святослав','Вакарчук','+380731122334','slava.v@email.com',NULL,NULL,'Чоловіча',1),(45,'Віталій','Кличко','+380501122334','vitaliy.k@email.com',NULL,NULL,'Чоловіча',1);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_student_insert` BEFORE INSERT ON `students` FOR EACH ROW BEGIN
    IF get_free_beds(NEW.room_id) <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Помилка: У цій кімнаті немає вільних місць!';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_student_insert` AFTER INSERT ON `students` FOR EACH ROW BEGIN
    UPDATE Rooms 
    SET current_occupancy = current_occupancy + 1 
    WHERE room_id = NEW.room_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_student_update` AFTER UPDATE ON `students` FOR EACH ROW BEGIN
    -- Якщо студента переселили в іншу кімнату (зміна кімнати)
    IF OLD.room_id IS NOT NULL AND NEW.room_id IS NOT NULL AND OLD.room_id != NEW.room_id THEN
        UPDATE rooms SET current_occupancy = current_occupancy - 1 WHERE room_id = OLD.room_id;
        UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = NEW.room_id;
    END IF;

    -- Якщо студента виселили (room_id стало NULL)
    IF OLD.room_id IS NOT NULL AND NEW.room_id IS NULL THEN
        UPDATE rooms SET current_occupancy = current_occupancy - 1 WHERE room_id = OLD.room_id;
    END IF;

    -- Якщо студента заселили з архіву (був NULL, стала кімната)
    IF OLD.room_id IS NULL AND NEW.room_id IS NOT NULL THEN
        UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = NEW.room_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_student_delete` AFTER DELETE ON `students` FOR EACH ROW BEGIN
    UPDATE Rooms 
    SET current_occupancy = current_occupancy - 1 
    WHERE room_id = OLD.room_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `v_debtors`
--

DROP TABLE IF EXISTS `v_debtors`;
/*!50001 DROP VIEW IF EXISTS `v_debtors`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_debtors` AS SELECT 
 1 AS `finance_id`,
 1 AS `student_id`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `phone`,
 1 AS `room_number`,
 1 AS `charge_type`,
 1 AS `amount`,
 1 AS `is_active`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'dormitory'
--

--
-- Dumping routines for database 'dormitory'
--
/*!50003 DROP FUNCTION IF EXISTS `get_free_beds` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `get_free_beds`(p_room_id INT) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE total_capacity INT;
    DECLARE occupied INT;
    SELECT capacity, current_occupancy INTO total_capacity, occupied FROM Rooms WHERE room_id = p_room_id;
    RETURN total_capacity - occupied;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_room_students` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_room_students`(IN p_room_number VARCHAR(10))
BEGIN
    SELECT s.first_name, s.last_name, s.phone
    FROM Students s
    JOIN Rooms r ON s.room_id = r.room_id
    WHERE r.room_number = p_room_number;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_debtors`
--

/*!50001 DROP VIEW IF EXISTS `v_debtors`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_debtors` AS select `f`.`finance_id` AS `finance_id`,`s`.`student_id` AS `student_id`,`s`.`first_name` AS `first_name`,`s`.`last_name` AS `last_name`,`s`.`phone` AS `phone`,`r`.`room_number` AS `room_number`,`f`.`charge_type` AS `charge_type`,`f`.`amount` AS `amount`,`s`.`is_active` AS `is_active` from ((`finances` `f` join `students` `s` on((`f`.`student_id` = `s`.`student_id`))) left join `rooms` `r` on((`s`.`room_id` = `r`.`room_id`))) where (`f`.`is_paid` = false) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-25 18:25:50
