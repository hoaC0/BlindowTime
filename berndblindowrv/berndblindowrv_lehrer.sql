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
-- Table structure for table `lehrer`
--

DROP TABLE IF EXISTS `lehrer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lehrer` (
  `vorname` char(50) DEFAULT NULL,
  `nachname` char(50) DEFAULT NULL,
  `email` char(100) DEFAULT NULL,
  `krzl` char(10) DEFAULT NULL,
  `tel` char(50) DEFAULT NULL,
  `lehrer_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`lehrer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lehrer`
--

LOCK TABLES `lehrer` WRITE;
/*!40000 ALTER TABLE `lehrer` DISABLE KEYS */;
INSERT INTO `lehrer` VALUES ('Uwe','Maulhardt','ita.fachleitung.fn@blindow.de','MAU','01735443980',1),('Lehrer','Nummer 2','lehrer2@blindow.de','L2','',2),('Lehrer','Nummer 3','lehrer3@blindow.de','L3','',3),('Max','Mustermann','E-Mail','MUST','1234567890',4),('Lisa','Schmidt','E-Mail','SCHM','9876543210',5),('Felix','Müller','E-Mail','MUEL','5678901234',6),('Anna','Becker','E-Mail','BECK','3456789012',7),('Tom','Wagner','E-Mail','WAGN','7890123456',8),('Julia','Meier','E-Mail','MEIE','2345678901',9),('Tobias','Fischer','E-Mail','FISC','8901234567',10),('Laura','Hoffmann','E-Mail','HOFF','9012345678',11),('Christian','Weber','E-Mail','WEBE','4567890123',12),('Sarah','Koch','E-Mail','KOCH','6789012345',13),('Daniel','Bauer','E-Mail','BAUE','1230984567',14),('Sophia','Lehmann','E-Mail','LEHM','9081726354',15),('Niklas','Schwarz','E-Mail','SCHW','8172635409',16),('Hannah','Krüger','E-Mail','KRUE','6354098172',17),('Florian','Wolf','E-Mail','WOLF','1726354098',18);
/*!40000 ALTER TABLE `lehrer` ENABLE KEYS */;
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
