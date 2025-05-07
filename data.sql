CREATE DATABASE  IF NOT EXISTS `iposarv3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iposarv3`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: iposarv3
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `attribute_values`
--

DROP TABLE IF EXISTS `attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute_values` (
  `attribute_value_id` int NOT NULL AUTO_INCREMENT,
  `attribute_id` int DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`attribute_value_id`),
  KEY `fk_attribute_values` (`attribute_id`),
  CONSTRAINT `fk_attribute_values` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_values`
--

LOCK TABLES `attribute_values` WRITE;
/*!40000 ALTER TABLE `attribute_values` DISABLE KEYS */;
INSERT INTO `attribute_values` (`attribute_value_id`, `attribute_id`, `value`) VALUES (1,1,'Black'),(2,1,'White'),(3,1,'Red'),(4,1,'Blue'),(5,1,'Green'),(6,2,'Steel'),(7,2,'Mesh'),(8,2,'PU leather'),(9,2,'Plastic'),(10,3,'800W'),(11,3,'1200W'),(12,3,'500W'),(13,4,'12 months'),(14,4,'6 months'),(15,4,'24 months'),(16,5,'5kg'),(17,5,'25kg'),(18,5,'1.2kg'),(19,6,'Small'),(20,6,'Medium'),(21,6,'Large'),(22,7,'Low'),(23,7,'Medium'),(24,7,'High'),(25,8,'6+'),(26,8,'12+'),(27,8,'All Ages'),(28,9,'Alexa'),(29,9,'Google'),(30,9,'None');
/*!40000 ALTER TABLE `attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attributes` (
  `attribute_id` int NOT NULL AUTO_INCREMENT,
  `attribute_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` (`attribute_id`, `attribute_name`) VALUES (1,'Color'),(2,'Material'),(3,'Power'),(4,'Battery Life'),(5,'Weight'),(6,'Size'),(7,'Brightness'),(8,'Age Group'),(9,'Voice Assistant');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` (`cart_id`, `user_id`, `updated_at`) VALUES (6,12,NULL),(7,12,NULL),(8,12,NULL),(9,12,NULL),(13,12,NULL),(14,12,NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_details`
--

DROP TABLE IF EXISTS `cart_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_details` (
  `cart_detail_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cart_detail_id`),
  KEY `cart_id_idx` (`cart_id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_details`
--

LOCK TABLES `cart_details` WRITE;
/*!40000 ALTER TABLE `cart_details` DISABLE KEYS */;
INSERT INTO `cart_details` (`cart_detail_id`, `cart_id`, `product_id`, `quantity`) VALUES (224,6,6,1),(226,7,6,1),(227,8,6,1),(232,9,6,1),(233,9,10,1),(238,14,12,1);
/*!40000 ALTER TABLE `cart_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cashiers`
--

DROP TABLE IF EXISTS `cashiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashiers` (
  `cashier_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cashier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashiers`
--

LOCK TABLES `cashiers` WRITE;
/*!40000 ALTER TABLE `cashiers` DISABLE KEYS */;
INSERT INTO `cashiers` (`cashier_id`, `name`, `shift`, `contact_info`) VALUES (12,'She','Morning','she@gmail.com');
/*!40000 ALTER TABLE `cashiers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES (2,'Electronics','Devices and gadgets such as phones, laptops, and accessories.'),(3,'Home Appliances','Household appliances like refrigerators, washers, and vacuums.'),(4,'Furniture','Items like sofas, beds, chairs, and tables for home and office.'),(5,'Clothing','Apparel for men, women, and children, including accessories.'),(6,'Sports & Outdoors','Equipment and clothing for various sports and outdoor activities.'),(7,'Health & Beauty','Products for personal care, wellness, and cosmetics.'),(8,'Books & Stationery','A variety of books, notebooks, and office supplies.'),(9,'Toys & Games','Playsets, games, and educational toys for kids.'),(10,'Groceries','Everyday food and beverages for home consumption.'),(11,'Automotive','Car accessories, parts, and tools.');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_types`
--

DROP TABLE IF EXISTS `client_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_types` (
  `client_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`client_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_types`
--

LOCK TABLES `client_types` WRITE;
/*!40000 ALTER TABLE `client_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `discount_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`discount_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `product_variant_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `inventory_type_id` int NOT NULL,
  `quantity_in_stock` decimal(10,2) NOT NULL,
  `reorder_level` decimal(10,2) DEFAULT NULL,
  `batch_number` varchar(45) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `storage_zone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `warehouse_id` (`warehouse_id`),
  KEY `inventory_type_id` (`inventory_type_id`),
  KEY `inventory_ibfk_1_idx` (`product_variant_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`product_variant_id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_ibfk_3` FOREIGN KEY (`inventory_type_id`) REFERENCES `inventory_type` (`inventory_type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` (`inventory_id`, `product_variant_id`, `warehouse_id`, `inventory_type_id`, `quantity_in_stock`, `reorder_level`, `batch_number`, `expiration_date`, `storage_zone`) VALUES (41,2,2,1,300.00,50.00,'BATCH-2025-02','2026-04-10','Zone B1'),(42,3,3,1,200.00,30.00,'BATCH-2025-03','2026-05-01','Zone C2'),(43,4,4,1,100.00,20.00,'BLEND-2024-001','2026-06-01','Zone B1'),(44,5,5,1,50.00,10.00,'DB-2024-044','2026-07-15','Zone C2'),(45,6,6,1,150.00,20.00,'LAMP-BATCH-778','2026-08-01','Zone A1'),(46,7,7,1,600.00,150.00,'BROWN-RICE-B23','2026-09-01','Zone F3'),(47,8,8,1,450.00,100.00,'SEATCVR-A2024','2026-10-01','Zone E2'),(48,9,9,1,350.00,75.00,'SERUM-BATCH-90','2026-11-01','Zone D1'),(49,10,10,1,250.00,50.00,'AIRP-2025-01','2026-12-01','Zone B2'),(50,11,11,1,450.00,100.00,'CHAIR-BATCH-334','2026-12-05','Zone C1'),(51,12,12,1,300.00,60.00,'ROBOT-TOY-B22','2026-12-10','Zone G1'),(52,13,13,1,120.00,20.00,'COOLER-B22-AS','2026-12-12','Zone H1');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_audit`
--

DROP TABLE IF EXISTS `inventory_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_audit` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `audited_quantity` decimal(10,2) NOT NULL,
  `audit_date` datetime NOT NULL,
  `auditor_name` varchar(255) NOT NULL,
  `discrepancy_note` text,
  PRIMARY KEY (`audit_id`),
  KEY `inventory_id` (`inventory_id`),
  CONSTRAINT `inventory_audit_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_audit`
--

LOCK TABLES `inventory_audit` WRITE;
/*!40000 ALTER TABLE `inventory_audit` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_type`
--

DROP TABLE IF EXISTS `inventory_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_type` (
  `inventory_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`inventory_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_type`
--

LOCK TABLES `inventory_type` WRITE;
/*!40000 ALTER TABLE `inventory_type` DISABLE KEYS */;
INSERT INTO `inventory_type` (`inventory_type_id`, `name`, `description`) VALUES (1,'Standard','Standard inventory type for regular products'),(2,'Bulk','Bulk inventory type for larger quantities'),(3,'Perishable','Inventory type for items with an expiration date');
/*!40000 ALTER TABLE `inventory_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturing_inventory`
--

DROP TABLE IF EXISTS `manufacturing_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturing_inventory` (
  `manufacturing_id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `batch_number` varchar(45) NOT NULL,
  `direct_material_cost` decimal(10,2) NOT NULL,
  `labor_cost` decimal(10,2) NOT NULL,
  `overhead_cost` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) GENERATED ALWAYS AS (((`direct_material_cost` + `labor_cost`) + `overhead_cost`)) STORED,
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`manufacturing_id`),
  KEY `inventory_id` (`inventory_id`),
  CONSTRAINT `manufacturing_inventory_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturing_inventory`
--

LOCK TABLES `manufacturing_inventory` WRITE;
/*!40000 ALTER TABLE `manufacturing_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `manufacturing_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message_content` text NOT NULL,
  `sent_date` datetime NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `monthly_sales`
--

DROP TABLE IF EXISTS `monthly_sales`;
/*!50001 DROP VIEW IF EXISTS `monthly_sales`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `monthly_sales` AS SELECT 
 1 AS `product_id`,
 1 AS `name`,
 1 AS `month`,
 1 AS `total_sold`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `notification_message` text NOT NULL,
  `notification_date` datetime NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `office_inventory_movements`
--

DROP TABLE IF EXISTS `office_inventory_movements`;
/*!50001 DROP VIEW IF EXISTS `office_inventory_movements`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `office_inventory_movements` AS SELECT 
 1 AS `movement_id`,
 1 AS `movement_date`,
 1 AS `product_id`,
 1 AS `product_name`,
 1 AS `quantity`,
 1 AS `movement_type`,
 1 AS `warehouse_name`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `price_history`
--

DROP TABLE IF EXISTS `price_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `retail_product_id` int NOT NULL,
  `old_price` decimal(10,2) NOT NULL,
  `new_price` decimal(10,2) NOT NULL,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_by` int NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `retail_product_id` (`retail_product_id`),
  KEY `changed_by` (`changed_by`),
  CONSTRAINT `price_history_ibfk_1` FOREIGN KEY (`retail_product_id`) REFERENCES `retail_products` (`retail_product_id`) ON DELETE CASCADE,
  CONSTRAINT `price_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_history`
--

LOCK TABLES `price_history` WRITE;
/*!40000 ALTER TABLE `price_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `price_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_details`
--

DROP TABLE IF EXISTS `product_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_details` (
  `product_detail_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `model_number` varchar(100) DEFAULT NULL,
  `specifications` text,
  `warranty_period` int DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `batch_number` varchar(45) DEFAULT NULL,
  `tax_class` enum('taxable','non_taxable','reduced_rate') DEFAULT 'taxable',
  `status` enum('active','discontinued') DEFAULT 'active',
  `media_url` varchar(45) DEFAULT NULL,
  `custom_attributes` json DEFAULT NULL,
  PRIMARY KEY (`product_detail_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_details`
--

LOCK TABLES `product_details` WRITE;
/*!40000 ALTER TABLE `product_details` DISABLE KEYS */;
INSERT INTO `product_details` (`product_detail_id`, `product_id`, `description`, `model_number`, `specifications`, `warranty_period`, `serial_number`, `batch_number`, `tax_class`, `status`, `media_url`, `custom_attributes`) VALUES (3,17,'Compact HEPA air purifier with smart sensor','AB-3000','HEPA filtration, Smart sensor, 3-speed fan, Sleep mode',24,'AB3000SN001','AIRP-2025-01','taxable','active','https://example.com/images/airpurifier.jpg','{\"filter_type\": \"HEPA\", \"coverage_area\": \"25 sqm\", \"smart_control\": true}'),(4,18,'Ergonomic mesh chair with lumbar support','EF-CH-BLK','Mesh back, Lumbar support, 360° swivel, Height adjustable',36,'EFCH2025A01','CHAIR-BATCH-334','taxable','active','https://example.com/images/ergochair.jpg','{\"color\": \"black\", \"material\": \"mesh\", \"adjustable_armrest\": true}'),(5,19,'Interactive transforming toy robot with lights and sounds','SPC-RB-T01','Transforming parts, LED lights, Sound effects, Battery operated',12,'SPC2025T334','ROBOT-TOY-B22','taxable','active','https://example.com/images/robot.jpg','{\"features\": [\"lights\", \"sounds\", \"transformation\"], \"age_group\": \"6+\", \"batteries_required\": true}'),(6,20,'High-performance CPU cooler with RGB fan','AS-F120','RGB fan, PWM control, Multi-socket compatibility, Silent mode',36,'AS120-FSN99','COOLER-B22-AS','taxable','active','https://example.com/images/cpucooler.jpg','{\"rgb\": true, \"fan_size\": \"120mm\", \"socket_support\": [\"AM4\", \"LGA1200\", \"LGA1700\"]}'),(7,21,'WiFi-enabled smart LED bulb with voice control support','XS-9W-WIFI','9W, WiFi control, Compatible with Alexa & Google, RGB color',18,'XSLED2025W9','BULB-X2025-A1','taxable','active','https://example.com/images/ledbulb.jpg','{\"wattage\": \"9W\", \"voice_assistant\": \"Alexa & Google\", \"color_temperature\": \"2700K-6500K\"}'),(8,22,'Graph-ruled notebook ideal for math and science','NB-STDY-GRPH','200 pages, Graph-ruled, Spiral binding, A4 size, 80gsm paper',6,'NB2025GR89','NOTE-BATCH-GR22','taxable','active','https://example.com/images/graph_notebook.jpg','{\"pages\": 200, \"binding\": \"spiral\", \"paper_quality\": \"80 gsm\"}'),(21,6,'Noise-cancelling Bluetooth headset with mic','BT-HS-MIC','Bluetooth 5.0, Noise-cancelling mic, 10hr battery life',12,'BTHS2025SN01','BATCH-2025-02','taxable','active','https://example.com/images/bh-3000.jpg','{}'),(22,10,'Color-changing smart bulb with WiFi connectivity','SLB-RGBW-100','WiFi control, RGB + White light, E27 base, app support',18,'SLBRGBW2025','BATCH-2025-03','taxable','active','https://example.com/images/slb-100.jpg','{}'),(23,11,'High-performance blender for smoothies and soups','UQ-BLND-5000','800W power, 5 speed settings, BPA-free jar',24,'BLND2025UQ01','BLEND-2024-001','taxable','active','https://example.com/images/blender.jpg','{\"color\": \"white\", \"power\": \"800W\", \"speed_settings\": 5}'),(24,12,'Adjustable dumbbells with anti-slip grip','PF-DB-25KG','Adjustable weights, Anti-slip grip, Steel core',36,'DB2025FIT88','DB-2024-044','taxable','active','https://example.com/images/dumbbells.jpg','{\"material\": \"steel\", \"weight_range\": \"5-25kg\"}'),(25,13,'LED reading lamp with brightness adjustment','CB-LMP-RD','LED light, Adjustable brightness, USB rechargeable',12,'CBLMP2025SN9','LAMP-BATCH-778','taxable','active','https://example.com/images/readinglamp.jpg','{\"usb_rechargeable\": true, \"brightness_levels\": 3}'),(26,14,'Locally sourced organic brown rice in eco-friendly packaging','ORG-RICE-5KG','Organic brown rice, Biodegradable packaging, Long grain',6,'ORGRC2025B5K','BROWN-RICE-B23','taxable','active','https://example.com/images/rice.jpg','{\"weight\": \"5kg\", \"packaging\": \"biodegradable\"}'),(27,15,'Waterproof and scratch-resistant seat covers','PSC-CAR-2PK','Waterproof, Scratch-resistant, Universal fit',18,'PSCSEAT2025','SEATCVR-A2024','taxable','active','https://example.com/images/seatcovers.jpg','{\"fit_type\": \"universal\", \"material\": \"PU leather\"}'),(28,16,'Nourishing serum for brighter skin','RG-FS-30ML','Brightening serum, Vitamin C + Hyaluronic Acid, 30ml',12,'RGSERUM30ML','SERUM-BATCH-90','taxable','active','https://example.com/images/face_serum.jpg','{\"volume\": \"30ml\", \"ingredients\": [\"vitamin C\", \"hyaluronic acid\"]}');
/*!40000 ALTER TABLE `product_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_movements`
--

DROP TABLE IF EXISTS `product_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_movements` (
  `movement_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `quantity` int NOT NULL,
  `movement_type` enum('IN','OUT') NOT NULL,
  `movement_date` datetime NOT NULL,
  `description` text,
  PRIMARY KEY (`movement_id`),
  KEY `product_id` (`product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `product_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `product_movements_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_movements`
--

LOCK TABLES `product_movements` WRITE;
/*!40000 ALTER TABLE `product_movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_serial_numbers`
--

DROP TABLE IF EXISTS `product_serial_numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_serial_numbers` (
  `serial_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `serial_number` varchar(100) NOT NULL,
  `status` enum('in_stock','sold','maintenance') DEFAULT 'in_stock',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`serial_id`),
  UNIQUE KEY `unique_serial_number` (`serial_number`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_serial_numbers_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_serial_numbers`
--

LOCK TABLES `product_serial_numbers` WRITE;
/*!40000 ALTER TABLE `product_serial_numbers` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_serial_numbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_types`
--

DROP TABLE IF EXISTS `product_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_types` (
  `product_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`product_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
INSERT INTO `product_types` (`product_type_id`, `name`, `description`) VALUES (3,'Electronic Device','Products that require power or electronics to function, like phones and laptops.'),(4,'Home Appliance','Devices that assist in daily household chores, like refrigerators and microwaves.'),(5,'Furniture','Household or office furniture such as sofas, chairs, and desks.'),(6,'Clothing & Apparel','Wearable products like shirts, pants, dresses, and accessories.'),(7,'Sports Equipment','Products used for physical activities and sports, like balls, rackets, and workout gear.'),(8,'Beauty & Personal Care','Products related to skincare, makeup, and personal hygiene.'),(9,'Books','Various genres and types of books for reading or study.'),(10,'Toys & Games','Fun products designed for play, entertainment, and education for children.'),(11,'Groceries','Food products, beverages, and other consumables for daily living.'),(12,'Automotive Parts','Components, accessories, and tools for cars, trucks, and other vehicles.');
/*!40000 ALTER TABLE `product_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_units`
--

DROP TABLE IF EXISTS `product_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_units` (
  `product_unit_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `unit_name` varchar(45) DEFAULT NULL,
  `conversion_factor` int DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_units`
--

LOCK TABLES `product_units` WRITE;
/*!40000 ALTER TABLE `product_units` DISABLE KEYS */;
INSERT INTO `product_units` (`product_unit_id`, `product_id`, `unit_name`, `conversion_factor`, `barcode`) VALUES (1,4,'box of 10',10,'0123456789123'),(2,10,'piece',1,'YNG1744005771062'),(3,10,'pack',4,'');
/*!40000 ALTER TABLE `product_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `product_variant_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_variant_id`),
  KEY `fk_product_variants` (`product_id`),
  CONSTRAINT `fk_product_variants` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` (`product_variant_id`, `product_id`, `sku`, `barcode`) VALUES (2,6,'BH-3000','YNG1743826487632'),(3,10,'SLB-100-RGBWw','YNG1744005771062'),(4,10,'SLB-100-5000','8945630023011'),(5,11,'FIT-DB-25KG','7564392201345'),(6,12,'LAMP-RD-BOOK','4432109876553'),(7,13,'RICE-ORG-5KG','9988123456790'),(8,14,'AUTO-PSC-2PK','1122334455667'),(9,16,'FACE-SERUM-01','8877665544321'),(10,17,'AIRP-AB-3000','8739201783920'),(11,18,'OFC-CH-FLEX-BLK','7849201345893'),(12,19,'TOY-ROB-SPC01','8899223344556'),(13,20,'CPU-COL-AS-F120','3322114455667'),(14,21,'LED-XEN-WIFI9W','7711223344556'),(15,22,'NB-GRAPH-STDY','6655443322110');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `brand_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_type_id` int DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  KEY `fk_product_type` (`product_type_id`),
  KEY `fk_supplier_idx` (`supplier_id`),
  CONSTRAINT `fk_product_type` FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`product_type_id`),
  CONSTRAINT `fk_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`product_id`, `supplier_id`, `name`, `category_id`, `barcode`, `brand_name`, `created_at`, `updated_at`, `product_type_id`) VALUES (6,2,'Bluetooth Headset',3,'4800131595385','Sony','2025-04-05 04:15:45','2025-04-26 03:58:17',3),(10,2,'Smart led bulb',5,'4800047820540','Philips','2025-04-07 06:07:13','2025-04-26 04:06:13',6),(11,2,'UltraQuiet Blender',3,'8945630023011','HomeComfort','2025-04-08 04:50:16','2025-04-08 04:50:16',4),(12,5,'Pro Fit Dumbbells Set',6,'7564392201345','Sportopia','2025-04-08 04:50:16','2025-04-08 04:50:16',7),(13,7,'CozyBook Reading Lamp',8,'4432109876553','BookNest','2025-04-08 04:50:16','2025-04-09 03:46:00',4),(14,9,'Organic Brown Rice 5kg',10,'9988123456790','FreshFarm','2025-04-08 04:50:16','2025-04-08 04:50:16',11),(15,10,'Premium Car Seat Covers',11,'1122334455667','AutoMax','2025-04-08 04:50:16','2025-04-08 04:50:16',12),(16,6,'RadiantGlow Face Serum',7,'8877665544321','BeautyBloom','2025-04-08 04:50:16','2025-04-08 04:50:16',8),(17,3,'AeroBreeze Air Purifier',3,'8739201783920','HomeComfort','2025-04-08 04:51:25','2025-04-08 04:51:25',4),(18,4,'ErgoFlex Office Chair',4,'7849201345893','Urban Living','2025-04-08 04:51:25','2025-04-08 04:51:25',5),(19,8,'SpaceBot Transforming Robot',9,'8899223344556','ToyGalaxy','2025-04-08 04:51:25','2025-04-08 04:51:25',10),(20,11,'ArcticStorm CPU Cooler',2,'3322114455667','NordicTech','2025-04-08 04:51:25','2025-04-08 04:51:25',3),(21,4,'XenonSmart LED Bulb',2,'7711223344556','TechSource','2025-04-08 04:51:25','2025-04-09 03:44:59',3),(22,7,'StudyMate Graph Notebook',8,'6655443322110','BookNest','2025-04-08 04:51:25','2025-04-08 04:51:25',9);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `supplier_id` int NOT NULL,
  `order_date` datetime NOT NULL,
  `status` enum('pending','pending_price','approved','shipped','delivered','cancelled') NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `client_id` (`client_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_requisitions`
--

DROP TABLE IF EXISTS `purchase_requisitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_requisitions` (
  `requisition_id` int NOT NULL AUTO_INCREMENT,
  `requestor_id` int NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `request_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `notes` text,
  PRIMARY KEY (`requisition_id`),
  KEY `requestor_id` (`requestor_id`),
  CONSTRAINT `purchase_requisitions_ibfk_1` FOREIGN KEY (`requestor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_requisitions`
--

LOCK TABLES `purchase_requisitions` WRITE;
/*!40000 ALTER TABLE `purchase_requisitions` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_requisitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retail_products`
--

DROP TABLE IF EXISTS `retail_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `retail_products` (
  `retail_product_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `product_unit_id` int DEFAULT NULL,
  `retail_price` decimal(10,2) NOT NULL,
  `promo_price` decimal(10,2) DEFAULT NULL,
  `markup_percentage` decimal(5,2) DEFAULT NULL,
  `quantity_in_stock` int NOT NULL,
  `promo_discount_price` decimal(10,2) DEFAULT NULL,
  `vat_tax` decimal(10,2) GENERATED ALWAYS AS (((`retail_price` - ifnull(`promo_discount_price`,0)) * 0.12)) STORED,
  `final_price` decimal(10,2) GENERATED ALWAYS AS (((`retail_price` - ifnull(`promo_discount_price`,0)) + `vat_tax`)) STORED,
  `margin_price` decimal(10,2) GENERATED ALWAYS AS ((`retail_price` - `base_cost`)) STORED,
  `base_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(10) DEFAULT 'USD',
  `effective_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`retail_product_id`),
  KEY `product_id` (`product_id`),
  KEY `product_unit_id_idx` (`product_unit_id`),
  CONSTRAINT `product_unit_id` FOREIGN KEY (`product_unit_id`) REFERENCES `product_units` (`product_unit_id`),
  CONSTRAINT `retail_products_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retail_products`
--

LOCK TABLES `retail_products` WRITE;
/*!40000 ALTER TABLE `retail_products` DISABLE KEYS */;
INSERT INTO `retail_products` (`retail_product_id`, `product_id`, `product_unit_id`, `retail_price`, `promo_price`, `markup_percentage`, `quantity_in_stock`, `promo_discount_price`, `base_cost`, `currency`, `effective_date`, `expiration_date`, `created_at`, `updated_at`) VALUES (2,6,1,129.99,109.99,20.00,50,20.00,90.00,'USD','2025-04-10','2025-05-10','2025-04-25 01:20:36','2025-04-25 01:20:36'),(3,10,2,18.99,14.99,26.75,120,4.00,11.50,'USD','2025-04-11','2025-06-01','2025-04-25 01:20:36','2025-04-25 01:20:36'),(4,11,2,74.50,NULL,30.00,30,NULL,57.31,'USD','2025-04-11',NULL,'2025-04-25 01:20:36','2025-04-25 01:20:36'),(5,12,2,59.99,49.99,25.00,25,10.00,40.00,'USD','2025-04-11','2025-06-30','2025-04-25 01:20:36','2025-04-25 01:20:36'),(6,13,2,24.99,NULL,20.00,80,NULL,20.82,'USD','2025-04-11',NULL,'2025-04-25 01:20:36','2025-04-25 01:20:36'),(7,14,2,9.99,8.99,11.12,200,1.00,8.99,'USD','2025-04-11','2025-05-15','2025-04-25 01:20:36','2025-04-25 01:20:36'),(8,15,2,39.99,34.99,14.29,70,5.00,30.00,'USD','2025-04-11','2025-06-01','2025-04-25 01:20:36','2025-04-25 01:20:36'),(9,16,2,19.99,17.99,11.12,60,2.00,16.50,'USD','2025-04-11','2025-06-01','2025-04-25 01:20:36','2025-04-25 01:20:36'),(10,17,2,149.99,129.99,20.00,15,20.00,110.00,'USD','2025-04-11','2025-06-15','2025-04-25 01:20:36','2025-04-25 01:20:36'),(11,18,2,89.99,NULL,25.00,40,NULL,72.00,'USD','2025-04-11',NULL,'2025-04-25 01:20:36','2025-04-25 01:20:36'),(12,19,2,29.99,24.99,16.67,95,5.00,20.00,'USD','2025-04-11','2025-05-30','2025-04-25 01:20:36','2025-04-25 01:20:36'),(13,20,2,59.99,NULL,20.00,22,NULL,47.99,'USD','2025-04-11',NULL,'2025-04-25 01:20:36','2025-04-25 01:20:36'),(14,21,2,17.99,14.99,28.59,110,3.00,12.50,'USD','2025-04-11','2025-05-31','2025-04-25 01:20:36','2025-04-25 01:20:36'),(15,22,2,4.99,3.99,25.06,300,1.00,3.20,'USD','2025-04-11','2025-06-01','2025-04-25 01:20:36','2025-04-25 01:20:36');
/*!40000 ALTER TABLE `retail_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retail_warehouse_inventory`
--

DROP TABLE IF EXISTS `retail_warehouse_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `retail_warehouse_inventory` (
  `retail_warehouse_id` int NOT NULL AUTO_INCREMENT,
  `retail_product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `quantity_in_stock` int NOT NULL,
  PRIMARY KEY (`retail_warehouse_id`),
  KEY `retail_product_id` (`retail_product_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `retail_warehouse_inventory_ibfk_1` FOREIGN KEY (`retail_product_id`) REFERENCES `retail_products` (`retail_product_id`) ON DELETE CASCADE,
  CONSTRAINT `retail_warehouse_inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retail_warehouse_inventory`
--

LOCK TABLES `retail_warehouse_inventory` WRITE;
/*!40000 ALTER TABLE `retail_warehouse_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `retail_warehouse_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_details`
--

DROP TABLE IF EXISTS `sale_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_details` (
  `sale_detail_id` int NOT NULL AUTO_INCREMENT,
  `sale_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` varchar(50) NOT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`sale_detail_id`),
  KEY `sale_id` (`sale_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`),
  CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_details`
--

LOCK TABLES `sale_details` WRITE;
/*!40000 ALTER TABLE `sale_details` DISABLE KEYS */;
INSERT INTO `sale_details` (`sale_detail_id`, `sale_id`, `product_id`, `quantity`, `price`, `discount_percent`, `discounted_price`) VALUES (118,65,11,1,'',0.00,74.50),(119,65,13,1,'',0.00,24.99),(120,66,12,1,'59.99',0.00,59.99),(121,67,15,1,'39.99',0.00,39.99),(122,68,6,1,'129.99',0.00,129.99),(123,68,10,3,'18.99',0.00,18.99),(124,69,10,6,'18.99',0.00,18.99),(125,69,12,1,'59.99',0.00,59.99),(126,70,10,3,'18.99',0.00,18.99),(127,70,6,2,'129.99',0.00,129.99),(128,71,11,1,'74.50',0.00,74.50),(129,71,12,1,'59.99',0.00,59.99),(130,72,10,1,'18.99',0.00,18.99),(131,72,11,1,'74.50',0.00,74.50);
/*!40000 ALTER TABLE `sale_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `sale_id` int NOT NULL AUTO_INCREMENT,
  `sale_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `cashier_id` int DEFAULT NULL,
  PRIMARY KEY (`sale_id`),
  KEY `cashier_id` (`cashier_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`cashier_id`) REFERENCES `cashiers` (`cashier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` (`sale_id`, `sale_date`, `total_amount`, `payment_method`, `cashier_id`) VALUES (64,'2025-04-26 03:02:43',99.49,'Cash',12),(65,'2025-04-26 03:03:52',99.49,'Cash',12),(66,'2025-04-26 03:40:06',59.99,'Cash',12),(67,'2025-04-26 03:47:07',39.99,'Cash',12),(68,'2025-04-26 03:47:52',186.96,'Cash',12),(69,'2025-04-26 03:48:59',173.93,'Cash',12),(70,'2025-04-26 04:08:42',316.95,'Cash',12),(71,'2025-04-26 05:42:58',134.49,'Cash',12),(72,'2025-04-26 06:22:03',93.49,'Cash',12);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` (`supplier_id`, `name`, `contact_person`, `phone_number`, `email`, `address`, `country`) VALUES (2,'TechSource Inc.','Alice Johnson','+1-800-555-1234','alice@techsource.com','123 Silicon Ave, San Jose, CA 95131','United States'),(3,'HomeComfort Appliances','Mark Chen','+86-21-8888-9999','mark.chen@homecomfort.cn','56 Nanjing Road, Shanghai','China'),(4,'Urban Living Furniture','Sofia Ramirez','+34-91-123-4567','sofia@urbanliving.es','Calle de Alcalá, 123, Madrid','Spain'),(5,'Sportopia Gear','Liam O\'Connor','+353-1-456-7890','liam@sportopia.ie','10 Riverwalk, Dublin','Ireland'),(6,'BeautyBloom Co.','Hannah Kim','+82-2-1234-5678','hannah.kim@beautybloom.kr','789 Gangnam-daero, Seoul','South Korea'),(7,'BookNest Distributors','Daniel Smith','+44-20-1234-5678','daniel@booknest.co.uk','45 Oxford Street, London','United Kingdom'),(8,'ToyGalaxy Ltd.','Aiko Tanaka','+81-3-1234-5678','aiko.t@toygalaxy.jp','1-2-3 Harajuku, Shibuya-ku, Tokyo','Japan'),(9,'FreshFarm Wholesale','Pedro Morales','+52-55-8765-4321','pedro@freshfarm.mx','Av. Insurgentes Sur 5000, Mexico City','Mexico'),(10,'AutoMax Parts Supply','John Williams','+1-312-555-6789','jwilliams@automax.com','1500 W Madison St, Chicago, IL 60607','United States'),(11,'NordicTech Components','Ingrid Olsen','+47-22-345-678','ingrid@nordictech.no','Storgata 45, Oslo','Norway');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('client','supplier','admin') NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `lead_time` int DEFAULT NULL,
  `supplier_rating` decimal(3,2) DEFAULT NULL,
  `certifications` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_attributes`
--

DROP TABLE IF EXISTS `variant_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_attributes` (
  `variant_attribute_id` int NOT NULL AUTO_INCREMENT,
  `product_variant_id` int DEFAULT NULL,
  `attribute_value_id` int DEFAULT NULL,
  PRIMARY KEY (`variant_attribute_id`),
  KEY `fk_variant_attribute2` (`attribute_value_id`),
  KEY `fk_variant_attribute2_idx` (`product_variant_id`),
  CONSTRAINT `fk_variant_attribute2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_attributes`
--

LOCK TABLES `variant_attributes` WRITE;
/*!40000 ALTER TABLE `variant_attributes` DISABLE KEYS */;
INSERT INTO `variant_attributes` (`variant_attribute_id`, `product_variant_id`, `attribute_value_id`) VALUES (1,4,1),(2,5,4),(3,6,1),(4,7,4),(5,8,1),(6,3,1),(7,3,6),(8,3,15);
/*!40000 ALTER TABLE `variant_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse_sensor_data`
--

DROP TABLE IF EXISTS `warehouse_sensor_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_sensor_data` (
  `sensor_data_id` int NOT NULL AUTO_INCREMENT,
  `warehouse_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `sensor_type` varchar(50) NOT NULL,
  `reading_value` decimal(10,2) NOT NULL,
  `reading_time` datetime NOT NULL,
  PRIMARY KEY (`sensor_data_id`),
  KEY `warehouse_id` (`warehouse_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `warehouse_sensor_data_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `warehouse_sensor_data_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_sensor_data`
--

LOCK TABLES `warehouse_sensor_data` WRITE;
/*!40000 ALTER TABLE `warehouse_sensor_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehouse_sensor_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `warehouse_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` text NOT NULL,
  `capacity` int DEFAULT NULL,
  PRIMARY KEY (`warehouse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` (`warehouse_id`, `name`, `location`, `capacity`) VALUES (1,'Warehouse A','1234 Industrial Rd, Cityville',1000),(2,'Warehouse B','5678 Commerce Blvd, Townsville',1500),(3,'Warehouse C','91011 Distribution Ave, Metrocity',2000),(4,'Warehouse D','1213 Storage Ln, Rivertown',800),(5,'Warehouse E','1415 Supply St, Lakeside',1200),(6,'Lamp Warehouse','Location F',NULL),(7,'Rice Warehouse','Location G',NULL),(8,'Seat Cover Warehouse','Location H',NULL),(9,'Serum Warehouse','Location I',NULL),(10,'Air Purifier Warehouse','Location J',NULL),(11,'Chair Warehouse','Location K',NULL),(12,'Toy Robot Warehouse','Location L',NULL),(13,'CPU Cooler Warehouse','Location M',NULL);
/*!40000 ALTER TABLE `warehouses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'iposarv3'
--

--
-- Dumping routines for database 'iposarv3'
--

--
-- Final view structure for view `monthly_sales`
--

/*!50001 DROP VIEW IF EXISTS `monthly_sales`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `monthly_sales` AS select `p`.`product_id` AS `product_id`,`p`.`name` AS `name`,date_format(`pm`.`movement_date`,'%Y-%m') AS `month`,sum((case when (`pm`.`movement_type` = 'OUT') then `pm`.`quantity` else 0 end)) AS `total_sold` from (`product_movements` `pm` join `products` `p` on((`pm`.`product_id` = `p`.`product_id`))) group by `p`.`product_id`,date_format(`pm`.`movement_date`,'%Y-%m') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `office_inventory_movements`
--

/*!50001 DROP VIEW IF EXISTS `office_inventory_movements`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `office_inventory_movements` AS select `pm`.`movement_id` AS `movement_id`,`pm`.`movement_date` AS `movement_date`,`p`.`product_id` AS `product_id`,`p`.`name` AS `product_name`,`pm`.`quantity` AS `quantity`,`pm`.`movement_type` AS `movement_type`,`w`.`name` AS `warehouse_name`,`pm`.`description` AS `description` from (((`product_movements` `pm` join `products` `p` on((`pm`.`product_id` = `p`.`product_id`))) join `warehouses` `w` on((`pm`.`warehouse_id` = `w`.`warehouse_id`))) join `categories` `c` on((`p`.`category_id` = `c`.`category_id`))) where (`c`.`name` like '%Office%') order by `pm`.`movement_date` desc */;
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

-- Dump completed on 2025-04-26 15:07:48
