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
-- Table structure for table `faecher`
--

DROP TABLE IF EXISTS `faecher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faecher` (
  `fach_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `kurzname` varchar(10) NOT NULL,
  `farbe` varchar(7) DEFAULT '#0f3c63',
  PRIMARY KEY (`fach_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faecher`
--

LOCK TABLES `faecher` WRITE;
/*!40000 ALTER TABLE `faecher` DISABLE KEYS */;
INSERT INTO `faecher` VALUES (1,'Mathematik','MAT','#4285F4'),(2,'Deutsch','DEU','#EA4335'),(3,'Englisch','ENG','#FBBC05'),(4,'Physik','PHY','#7B1FA2'),(5,'Chemie','CHE','#EA4335'),(6,'Biologie','BIO','#34A853'),(7,'Geschichte','GES','#FF9800'),(8,'Informatik','INF','#0097A7'),(9,'Wirtschaft','WIR','#795548'),(10,'Sport','SPO','#607D8B'),(11,'Kunst','KUN','#9C27B0'),(12,'Musik','MUS','#673AB7'),(13,'Ethik','ETH','#3F51B5'),(14,'Projektarbeit','PRO','#0097A7'),(15,'Gesundheit','GES','#E91E63'),(16,'Pharmazie','PHA','#7B1FA2');
/*!40000 ALTER TABLE `faecher` ENABLE KEYS */;
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
