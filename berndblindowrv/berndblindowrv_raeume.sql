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
-- Table structure for table `raeume`
--

DROP TABLE IF EXISTS `raeume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raeume` (
  `raum_id` int NOT NULL AUTO_INCREMENT,
  `nummer` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`raum_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raeume`
--

LOCK TABLES `raeume` WRITE;
/*!40000 ALTER TABLE `raeume` DISABLE KEYS */;
INSERT INTO `raeume` VALUES (1,'001','Klassenzimmer'),(2,'002','Klassenzimmer'),(3,'003','Klassenzimmer'),(4,'004','Klassenzimmer'),(5,'005','Klassenzimmer'),(6,'006','Klassenzimmer'),(7,'007','Klassenzimmer'),(8,'008','Klassenzimmer'),(9,'009','Klassenzimmer'),(10,'010','Klassenzimmer'),(11,'101','Klassenzimmer'),(12,'102','Klassenzimmer'),(13,'103','Klassenzimmer'),(14,'104','Klassenzimmer'),(15,'105','Klassenzimmer'),(16,'106','Klassenzimmer'),(17,'107','Klassenzimmer'),(18,'108','Klassenzimmer'),(19,'109','Klassenzimmer'),(20,'110','Klassenzimmer'),(21,'201','Labor'),(22,'202','Labor'),(23,'203','Labor'),(24,'204','Labor'),(25,'205','Kunst'),(26,'Mensa','Cafeteria'),(27,'Labor 1','Biologie-Labor'),(28,'Labor 2','Chemie-Labor'),(29,'PC-Lab 1','Computer-Raum'),(30,'PC-Lab 2','Computer-Raum'),(31,'Bibliothek','Schulbibliothek'),(32,'Sporthalle','Turnhalle');
/*!40000 ALTER TABLE `raeume` ENABLE KEYS */;
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
