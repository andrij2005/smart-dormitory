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
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `before_finance_update` BEFORE UPDATE ON `finances` FOR EACH ROW BEGIN

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
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `before_room_delete` BEFORE DELETE ON `rooms` FOR EACH ROW BEGIN

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
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `before_student_insert` BEFORE INSERT ON `students` FOR EACH ROW BEGIN

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
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `after_student_insert` AFTER INSERT ON `students` FOR EACH ROW BEGIN

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
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `after_student_update` AFTER UPDATE ON `students` FOR EACH ROW BEGIN

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
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `after_student_delete` AFTER DELETE ON `students` FOR EACH ROW BEGIN

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
CREATE  FUNCTION `get_free_beds`(p_room_id INT) RETURNS int
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
CREATE  PROCEDURE `get_room_students`(IN p_room_number VARCHAR(10))
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
/*!50013  SQL SECURITY DEFINER */
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

-- Dump completed on 2026-05-25 18:10:09
