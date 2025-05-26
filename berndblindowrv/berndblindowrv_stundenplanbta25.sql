-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: berndblindowrv
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `stundenplanbta25`
--

DROP TABLE IF EXISTS `stundenplanbta25`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stundenplanbta25` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stunde` int NOT NULL,
  `zeit` varchar(20) NOT NULL,
  `fach_mo` int DEFAULT NULL,
  `raum_mo` int DEFAULT NULL,
  `lehrer_mo` int DEFAULT NULL,
  `fach_di` int DEFAULT NULL,
  `raum_di` int DEFAULT NULL,
  `lehrer_di` int DEFAULT NULL,
  `fach_mi` int DEFAULT NULL,
  `raum_mi` int DEFAULT NULL,
  `lehrer_mi` int DEFAULT NULL,
  `fach_do` int DEFAULT NULL,
  `raum_do` int DEFAULT NULL,
  `lehrer_do` int DEFAULT NULL,
  `fach_fr` int DEFAULT NULL,
  `raum_fr` int DEFAULT NULL,
  `lehrer_fr` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stundenplanbta25_fach_mo` (`fach_mo`),
  KEY `fk_stundenplanbta25_fach_di` (`fach_di`),
  KEY `fk_stundenplanbta25_fach_mi` (`fach_mi`),
  KEY `fk_stundenplanbta25_fach_do` (`fach_do`),
  KEY `fk_stundenplanbta25_fach_fr` (`fach_fr`),
  KEY `fk_stundenplanbta25_raum_mo` (`raum_mo`),
  KEY `fk_stundenplanbta25_raum_di` (`raum_di`),
  KEY `fk_stundenplanbta25_raum_mi` (`raum_mi`),
  KEY `fk_stundenplanbta25_raum_do` (`raum_do`),
  KEY `fk_stundenplanbta25_raum_fr` (`raum_fr`),
  KEY `fk_stundenplanbta25_lehrer_mo` (`lehrer_mo`),
  KEY `fk_stundenplanbta25_lehrer_di` (`lehrer_di`),
  KEY `fk_stundenplanbta25_lehrer_mi` (`lehrer_mi`),
  KEY `fk_stundenplanbta25_lehrer_do` (`lehrer_do`),
  KEY `fk_stundenplanbta25_lehrer_fr` (`lehrer_fr`),
  CONSTRAINT `fk_stundenplanbta25_fach_di` FOREIGN KEY (`fach_di`) REFERENCES `faecher` (`fach_id`),
  CONSTRAINT `fk_stundenplanbta25_fach_do` FOREIGN KEY (`fach_do`) REFERENCES `faecher` (`fach_id`),
  CONSTRAINT `fk_stundenplanbta25_fach_fr` FOREIGN KEY (`fach_fr`) REFERENCES `faecher` (`fach_id`),
  CONSTRAINT `fk_stundenplanbta25_fach_mi` FOREIGN KEY (`fach_mi`) REFERENCES `faecher` (`fach_id`),
  CONSTRAINT `fk_stundenplanbta25_fach_mo` FOREIGN KEY (`fach_mo`) REFERENCES `faecher` (`fach_id`),
  CONSTRAINT `fk_stundenplanbta25_lehrer_di` FOREIGN KEY (`lehrer_di`) REFERENCES `lehrer` (`lehrer_id`),
  CONSTRAINT `fk_stundenplanbta25_lehrer_do` FOREIGN KEY (`lehrer_do`) REFERENCES `lehrer` (`lehrer_id`),
  CONSTRAINT `fk_stundenplanbta25_lehrer_fr` FOREIGN KEY (`lehrer_fr`) REFERENCES `lehrer` (`lehrer_id`),
  CONSTRAINT `fk_stundenplanbta25_lehrer_mi` FOREIGN KEY (`lehrer_mi`) REFERENCES `lehrer` (`lehrer_id`),
  CONSTRAINT `fk_stundenplanbta25_lehrer_mo` FOREIGN KEY (`lehrer_mo`) REFERENCES `lehrer` (`lehrer_id`),
  CONSTRAINT `fk_stundenplanbta25_raum_di` FOREIGN KEY (`raum_di`) REFERENCES `raeume` (`raum_id`),
  CONSTRAINT `fk_stundenplanbta25_raum_do` FOREIGN KEY (`raum_do`) REFERENCES `raeume` (`raum_id`),
  CONSTRAINT `fk_stundenplanbta25_raum_fr` FOREIGN KEY (`raum_fr`) REFERENCES `raeume` (`raum_id`),
  CONSTRAINT `fk_stundenplanbta25_raum_mi` FOREIGN KEY (`raum_mi`) REFERENCES `raeume` (`raum_id`),
  CONSTRAINT `fk_stundenplanbta25_raum_mo` FOREIGN KEY (`raum_mo`) REFERENCES `raeume` (`raum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stundenplanbta25`
--

LOCK TABLES `stundenplanbta25` WRITE;
/*!40000 ALTER TABLE `stundenplanbta25` DISABLE KEYS */;
INSERT INTO `stundenplanbta25` VALUES (1,1,'08:00 - 08:45',NULL,NULL,NULL,6,27,3,7,14,11,8,29,10,9,15,12),(2,2,'08:45 - 09:30',NULL,NULL,NULL,6,27,3,7,14,11,8,29,10,9,15,12),(3,3,'09:45 - 10:30',5,28,4,1,11,1,11,30,13,4,21,8,NULL,NULL,NULL),(4,4,'10:30 - 11:15',5,28,4,1,11,1,11,30,13,4,21,8,NULL,NULL,NULL),(5,5,'11:30 - 12:15',3,13,5,2,12,2,15,18,17,NULL,NULL,NULL,1,11,1),(6,6,'12:15 - 13:00',3,13,5,2,12,2,15,18,17,NULL,NULL,NULL,1,11,1),(7,7,'14:00 - 14:45',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,8,'14:45 - 15:30',14,29,15,8,29,10,NULL,NULL,NULL,10,32,7,2,12,2),(9,9,'15:45 - 16:30',14,29,15,8,29,10,NULL,NULL,NULL,10,32,7,2,12,2),(10,10,'16:30 - 17:15',10,32,7,NULL,NULL,NULL,8,29,10,NULL,NULL,NULL,13,16,14),(11,11,'17:30 - 18:15',10,32,7,NULL,NULL,NULL,8,29,10,NULL,NULL,NULL,13,16,14),(12,12,'18:15 - 19:00',NULL,NULL,NULL,NULL,NULL,NULL,14,29,15,NULL,NULL,NULL,NULL,NULL,NULL),(13,13,'19:15 - 20:00',NULL,NULL,NULL,NULL,NULL,NULL,14,29,15,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `stundenplanbta25` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-16 16:57:34
