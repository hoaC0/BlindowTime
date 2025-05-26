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
-- Table structure for table `schueler`
--

DROP TABLE IF EXISTS `schueler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schueler` (
  `schueler_id` int NOT NULL AUTO_INCREMENT,
  `vorname` char(50) NOT NULL,
  `nachname` char(50) NOT NULL,
  `geburtsdatum` date DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `tel` char(50) DEFAULT NULL,
  `email` char(100) DEFAULT NULL,
  `klasse_id` int DEFAULT NULL,
  `note_id` int DEFAULT NULL,
  PRIMARY KEY (`schueler_id`),
  KEY `fk_schueler_note` (`note_id`),
  KEY `fk_schueler_klasse` (`klasse_id`),
  CONSTRAINT `fk_schueler_klasse` FOREIGN KEY (`klasse_id`) REFERENCES `klassen` (`klassen_id`),
  CONSTRAINT `fk_schueler_note` FOREIGN KEY (`note_id`) REFERENCES `noten` (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schueler`
--

LOCK TABLES `schueler` WRITE;
/*!40000 ALTER TABLE `schueler` DISABLE KEYS */;
INSERT INTO `schueler` VALUES (1,'Hoa','Chau','2005-10-10','Paulinenstr.24','01742666583','hoachau1010@gmail.com',NULL,NULL),(3,'Max','Mustermann','2005-05-15','Musterstraße 1, 12345 Berlin','0123456789','E-Mail',NULL,NULL),(4,'Anna','Schmidt','2006-07-22','Hauptstraße 42, 10115 Berlin','0176987654','E-Mail',NULL,NULL),(5,'Leon','Müller','2005-11-30','Friedrichstraße 120, 10117 Berlin','01708273645','E-Mail',NULL,NULL),(6,'Sophia','Wagner','2006-02-18','Unter den Linden 5, 10117 Berlin','0157827364','E-Mail',NULL,NULL),(7,'Paul','Meyer','2007-09-10','Alexanderplatz 7, 10178 Berlin','015512345','E-Mail',NULL,NULL),(8,'Lena','Schulz','2005-03-25','Kurfürstendamm 231, 10719 Berlin','017198765','E-Mail',NULL,NULL),(9,'Tim','Hofmann','2006-12-05','Kantstraße 57, 10627 Berlin','0163666777','E-Mail',NULL,NULL),(10,'Emma','Fischer','2007-01-17','Torstraße 123, 10119 Berlin','01721212312','E-Mail',NULL,NULL),(11,'Noah','Weber','2005-08-28','Potsdamer Platz 1, 10785 Berlin','01551092837','E-Mail',NULL,NULL),(12,'Mia','Schneider','2006-06-11','Schönhauser Allee 80, 10439 Berlin','0171765432','E-Mail',NULL,NULL),(13,'Jonas','Becker','2006-03-12','Rosenthaler Str. 45, 10119 Berlin','015712345678','E-Mail',NULL,NULL),(14,'Lara','Hoffmann','2007-05-23','Kastanienallee 22, 10435 Berlin','017623456789','E-Mail',NULL,NULL),(15,'Felix','Koch','2005-09-14','Oranienstraße 14, 10999 Berlin','017834567890','E-Mail',NULL,NULL),(16,'Laura','Richter','2006-11-07','Invalidenstraße 30, 10115 Berlin','015945678901','E-Mail',NULL,NULL),(17,'David','Wolf','2007-02-19','Warschauer Str. 55, 10243 Berlin','016056789012','E-Mail',NULL,NULL),(18,'Julia','Schäfer','2005-06-30','Boxhagener Str. 73, 10245 Berlin','017167890123','E-Mail',NULL,NULL),(19,'Niklas','Bauer','2006-01-25','Simon-Dach-Str. 6, 10245 Berlin','017278901234','E-Mail',NULL,NULL),(20,'Hannah','Lange','2007-08-16','Bergmannstraße 42, 10961 Berlin','015389012345','E-Mail',NULL,NULL),(21,'Simon','Krause','2005-04-22','Graefestraße 11, 10967 Berlin','017490123456','E-Mail',NULL,NULL),(22,'Sophie','Werner','2006-07-13','Weserstraße 53, 12045 Berlin','016001234567','E-Mail',NULL,NULL),(23,'Ben','Schmitt','2007-10-05','Sonnenallee 107, 12045 Berlin','017612345678','E-Mail',NULL,NULL),(24,'Emilia','Schultz','2005-12-29','Karl-Marx-Str. 83, 12043 Berlin','017823456789','E-Mail',NULL,NULL),(25,'Julian','Herrmann','2006-04-11','Hermannstraße 164, 12051 Berlin','015934567890','E-Mail',NULL,NULL),(26,'Amelie','König','2007-07-03','Wilmersdorfer Str. 76, 10629 Berlin','016045678901','E-Mail',NULL,NULL),(27,'Elias','Walter','2005-10-24','Knesebeckstraße 29, 10623 Berlin','017156789012','E-Mail',NULL,NULL),(28,'Lina','Meier','2006-02-08','Fasanenstraße 42, 10719 Berlin','017267890123','E-Mail',NULL,NULL),(29,'Moritz','Hartmann','2007-05-17','Budapester Str. 15, 10787 Berlin','015378901234','E-Mail',NULL,NULL),(30,'Paula','Winter','2005-01-09','Savignyplatz, 3, 10623 Berlin','017489012345','E-Mail',NULL,NULL),(31,'Finn','Beck','2006-06-21','Kurfürstenstraße 13, 10785 Berlin','016090123456','E-Mail',NULL,NULL),(32,'Johanna','Vogel','2007-09-02','Nürnberger Str. 9, 10789 Berlin','017601234567','E-Mail',NULL,NULL),(33,'Luis','Keller','2005-11-15','Maaßenstraße 8, 10777 Berlin','017812345678','E-Mail',NULL,NULL),(34,'Marie','Friedrich','2006-03-26','Gleimstraße 31, 10437 Berlin','015923456789','E-Mail',NULL,NULL),(35,'Anton','Berger','2007-12-18','Stargarder Str. 60, 10437 Berlin','016034567890','E-Mail',NULL,NULL),(36,'Ida','Schubert','2005-07-10','Lychener Str. 54, 10437 Berlin','017145678901','E-Mail',NULL,NULL),(37,'Henry','Lorenz','2006-09-01','Danziger Straße 18, 10435 Berlin','017256789012','E-Mail',NULL,NULL),(38,'Maja','Huber','2007-01-23','Prenzlauer Allee 89, 10405 Berlin','015367890123','E-Mail',NULL,NULL),(39,'Oskar','Krüger','2005-04-14','Kollwitzstraße 42, 10405 Berlin','017478901234','E-Mail',NULL,NULL),(40,'Louisa','Braun','2006-08-06','Rykestraße 15, 10405 Berlin','016089012345','E-Mail',NULL,NULL),(41,'Leo','Zimmermann','2007-11-27','Wörther Str. 38, 10405 Berlin','017600123456','hoachau1010@gmail.com',1,NULL),(42,'Clara','Schmitz','2005-02-20','Pappelallee 10, 10437 Berlin','017811234567','E-Mail',NULL,NULL),(43,'Samuel','Ludwig','2006-05-12','Sredzkistraße 7, 10435 Berlin','015922345678','E-Mail',NULL,NULL),(44,'Olivia','Fiedler','2007-08-03','Weinbergsweg 20, 10119 Berlin','016033456789','E-Mail',NULL,NULL),(45,'Oscar','Schuster','2005-10-25','Brunnenstraße 13, 10119 Berlin','017144567890','E-Mail',NULL,NULL),(46,'Matilda','Sauer','2006-01-16','Alte Schönhauser Str. 11, 10119 Berlin','017255678901','E-Mail',NULL,NULL),(47,'Jonathan','Neumann','2007-04-07','Linienstraße 40, 10119 Berlin','015366789012','E-Mail',NULL,NULL),(48,'Victoria','Schwarz','2005-06-29','Oranienburger Str. 67, 10117 Berlin','017477890123','E-Mail',NULL,NULL),(49,'Jakob','Zimmermann','2006-09-20','Johannisstraße 20, 10117 Berlin','016088901234','E-Mail',NULL,NULL),(50,'Frieda','Böhm','2007-12-11','Auguststraße 19, 10117 Berlin','017699012345','E-Mail',NULL,NULL),(51,'Emil','Schreiber','2005-03-03','Ackerstraße 15, 13355 Berlin','017800123456','E-Mail',NULL,NULL),(52,'Nele','Albrecht','2006-05-24','Bernauer Str. 35, 13355 Berlin','015911234567','E-Mail',NULL,NULL),(53,'Theo','Frank','2007-08-15','Rheinsberger Str. 8, 10115 Berlin','016022345678','E-Mail',NULL,NULL),(54,'Charlotte','Peter','2005-11-07','Gartenstraße 10, 10115 Berlin','017133456789','E-Mail',NULL,NULL),(55,'Phil','Weiß','2006-02-28','Anklamer Str. 6, 10115 Berlin','017244567890','E-Mail',NULL,NULL),(56,'Mila','Jäger','2007-05-19','Zinnowitzer Str. 1, 10115 Berlin','015355678901','E-Mail',NULL,NULL),(57,'Matteo','Otto','2005-07-11','Fürstenberger Str. 4, 10435 Berlin','017466789012','E-Mail',NULL,NULL),(58,'Ella','Simon','2006-10-02','Torstraße 60, 10119 Berlin','016077890123','E-Mail',NULL,NULL),(59,'Liam','Arnold','2007-01-24','Mulackstraße 15, 10119 Berlin','017688901234','E-Mail',NULL,NULL),(60,'Mira','Heinrich','2005-04-15','Steinstraße 21, 10119 Berlin','017899012345','E-Mail',NULL,NULL),(61,'Rafael','Franke','2006-07-06','Rosa-Luxemburg-Str. 13, 10178 Berlin','015900123456','E-Mail',NULL,NULL),(62,'Stella','Kuhn','2007-09-27','Neue Schönhauser Str. 11, 10178 Berlin','016011234567','E-Mail',NULL,NULL),(63,'Lukas','Stein','2005-12-19','Memhardstraße 8, 10178 Berlin','017122345678','E-Mail',NULL,NULL),(64,'Helena','Voigt','2006-03-10','Gipsstraße 3, 10119 Berlin','017233456789','E-Mail',NULL,NULL),(65,'Aaron','Graf','2007-06-01','Hackescher Markt 4, 10178 Berlin','015344567890','E-Mail',NULL,NULL),(66,'Mathilda','Roth','2005-08-23','Dircksenstraße 41, 10178 Berlin','017455678901','E-Mail',NULL,NULL),(67,'Till','Seidel','2006-11-14','Panoramastraße 1, 10178 Berlin','016066789012','E-Mail',NULL,NULL),(68,'Antonia','Haas','2007-02-05','Karl-Liebknecht-Str. 1, 10178 Berlin','017677890123','E-Mail',NULL,NULL),(69,'Valentin','Kern','2005-05-27','Am Lustgarten 1, 10178 Berlin','017888901234','E-Mail',NULL,NULL),(70,'Pauline','Wolff','2006-08-18','Werderscher Markt 13, 10117 Berlin','015999012345','E-Mail',NULL,NULL),(71,'Vincent','Hahn','2007-11-09','Burgstraße 27, 10178 Berlin','016000123456','E-Mail',NULL,NULL),(72,'Alma','Jung','2005-01-31','Fischerinsel 10, 10179 Berlin','017111234567','E-Mail',NULL,NULL),(73,'Milan','Horn','2006-04-22','Köpenicker Str. 70, 10179 Berlin','017222345678','E-Mail',NULL,NULL),(74,'Rosalie','Pohl','2007-07-13','Heinrich-Heine-Str. 12, 10179 Berlin','015333456789','E-Mail',NULL,NULL),(75,'Jannik','Busch','2005-09-04','Brückenstraße 3, 10179 Berlin','017444567890','E-Mail',NULL,NULL),(76,'Romy','Förster','2006-12-26','Rungestraße 20, 10179 Berlin','016055678901','E-Mail',NULL,NULL),(77,'Joshua','Engel','2007-03-17','Michaelkirchstraße 13, 10179 Berlin','017666789012','E-Mail',NULL,NULL),(78,'Mina','Fuchs','2005-05-09','Melchiorstraße 1, 10179 Berlin','017877890123','E-Mail',NULL,NULL),(79,'Theodor','Vogt','2006-08-30','Engeldamm 70, 10179 Berlin','015988901234','E-Mail',NULL,NULL),(80,'dwadwad','dwadwa','2006-10-10','Paulinenstr.24','01742666583','hoachau1010@gmail.com',1,NULL),(81,'Hoa','Chau','2003-10-10','Schillerstrasse 37','01742666583','hoachau1010@gmail.com',1,NULL);
/*!40000 ALTER TABLE `schueler` ENABLE KEYS */;
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
