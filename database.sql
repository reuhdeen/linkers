CREATE DATABASE  IF NOT EXISTS `iposarv3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iposarv3`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: iposarv3
-- ------------------------------------------------------
-- Server version	8.0.42

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
INSERT INTO `attribute_values` VALUES (1,1,'Black'),(2,1,'White'),(3,1,'Red'),(4,1,'Blue'),(5,1,'Green'),(6,2,'Steel'),(7,2,'Mesh'),(8,2,'PU leather'),(9,2,'Plastic'),(10,3,'800W'),(11,3,'1200W'),(12,3,'500W'),(13,4,'12 months'),(14,4,'6 months'),(15,4,'24 months'),(16,5,'5kg'),(17,5,'25kg'),(18,5,'1.2kg'),(19,6,'Small'),(20,6,'Medium'),(21,6,'Large'),(22,7,'Low'),(23,7,'Medium'),(24,7,'High'),(25,8,'6+'),(26,8,'12+'),(27,8,'All Ages'),(28,9,'Alexa'),(29,9,'Google'),(30,9,'None');
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
INSERT INTO `attributes` VALUES (1,'Color'),(2,'Material'),(3,'Power'),(4,'Battery Life'),(5,'Weight'),(6,'Size'),(7,'Brightness'),(8,'Age Group'),(9,'Voice Assistant');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Sony',NULL,'2025-07-12 21:58:27'),(2,'Philips',NULL,'2025-07-12 21:58:27'),(3,'HomeComfort',NULL,'2025-07-12 21:58:27'),(4,'Sportopia',NULL,'2025-07-12 21:58:27'),(5,'BookNest',NULL,'2025-07-12 21:58:27'),(6,'FreshFarm',NULL,'2025-07-12 21:58:27'),(7,'AutoMax',NULL,'2025-07-12 21:58:27'),(8,'BeautyBloom',NULL,'2025-07-12 21:58:27'),(9,'Urban Living',NULL,'2025-07-12 21:58:27'),(10,'ToyGalaxy',NULL,'2025-07-12 21:58:27'),(11,'NordicTech',NULL,'2025-07-12 21:58:27'),(12,'TechSource',NULL,'2025-07-12 21:58:27'),(13,'Biogesic',NULL,'2025-07-12 21:58:27'),(14,'Test-XXXX',NULL,'2025-07-12 21:58:27');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (6,12,'2025-05-07 16:22:25'),(7,12,'2025-05-07 16:22:28'),(8,12,'2025-05-07 16:22:31'),(9,12,'2025-05-07 16:22:33'),(13,12,'2025-05-07 16:22:35'),(14,12,'2025-05-07 16:22:39'),(15,12,'2025-05-07 16:34:08'),(16,12,'2025-05-07 16:34:11'),(21,12,'2025-06-19 14:32:55'),(23,12,'2025-06-19 14:38:47'),(24,12,'2025-07-07 17:20:56'),(25,12,'2025-07-09 17:03:43'),(26,12,NULL),(27,12,NULL),(28,12,NULL),(29,12,NULL);
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
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_details`
--

LOCK TABLES `cart_details` WRITE;
/*!40000 ALTER TABLE `cart_details` DISABLE KEYS */;
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
INSERT INTO `cashiers` VALUES (12,'She','Morning','she@gmail.com');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (2,'Electronics','Devices and gadgets such as phones, laptops, and accessories.'),(3,'Home Appliances','Household appliances like refrigerators, washers, and vacuums.'),(4,'Furniture','Items like sofas, beds, chairs, and tables for home and office.'),(5,'Clothing','Apparel for men, women, and children, including accessories.'),(6,'Sports & Outdoors','Equipment and clothing for various sports and outdoor activities.'),(7,'Health & Beauty','Products for personal care, wellness, and cosmetics.'),(8,'Books & Stationery','A variety of books, notebooks, and office supplies.'),(9,'Toys & Games','Playsets, games, and educational toys for kids.'),(10,'Groceries','Everyday food and beverages for home consumption.'),(11,'Automotive','Car accessories, parts, and tools.'),(12,'Pharmacy','offers prescription and OTC medicines, supplements, personal care items, medical equipment, first aid supplies, and health & wellness products'),(13,'OTC Medicine','Over the counter, no need rx'),(14,'sfwsfdw','ddd');
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
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `storage_path` text NOT NULL,
  `file_size_kb` int NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uploader` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
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
  `inventory_status` enum('in_stock','reserved','damaged') DEFAULT 'in_stock',
  `location_code` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `warehouse_id` (`warehouse_id`),
  KEY `inventory_type_id` (`inventory_type_id`),
  KEY `inventory_ibfk_1_idx` (`product_variant_id`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`product_variant_id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_ibfk_3` FOREIGN KEY (`inventory_type_id`) REFERENCES `inventory_type` (`inventory_type_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_type`
--

LOCK TABLES `inventory_type` WRITE;
/*!40000 ALTER TABLE `inventory_type` DISABLE KEYS */;
INSERT INTO `inventory_type` VALUES (1,'Standard','Standard inventory type for regular products'),(2,'Bulk','Bulk inventory type for larger quantities'),(3,'Perishable','Inventory type for items with an expiration date'),(4,'Returned','Items returned by customers or transferred back to stock'),(5,'Damaged','Inventory that is broken, defective, or unsellable'),(6,'Consignment','Vendor-owned stock held temporarily until sold'),(7,'Serialized','Inventory tracked by serial number for warranty or service'),(8,'Sample','Non-sale inventory used for demo or marketing purposes');
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
  `media_url` varchar(5000) DEFAULT NULL,
  `custom_attributes` json DEFAULT NULL,
  PRIMARY KEY (`product_detail_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_details`
--

LOCK TABLES `product_details` WRITE;
/*!40000 ALTER TABLE `product_details` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
INSERT INTO `product_types` VALUES (3,'Electronic Device','Products that requires powers or electronics to function, like phones and laptops.'),(4,'Home Appliance','Devices that assist in daily houseold chores, like refrigerators and microwaves.'),(5,'Furniture','Household or offsice furnitussre such as sofas, chairs, and desks.'),(6,'Clothing & Apparel','Wearable products like shirts, pants, dresses, and accessories.'),(7,'Sports Equipment','Products used for physical activities and sports, like balls, rackets, and workout gear.'),(8,'Beauty & Personal Care','Products related to skincare, makeup, and personal hygiene.'),(9,'Books','Various genres and types of books for reading or study.'),(10,'Toys & Games','Fun products designed for play, entertainment, and education for children.'),(11,'Groceries','Food products, beverages, and other consumables for daily living.'),(12,'Automotive Parts','Components, accessories, and tools for cars, trucks, and other vehicles.'),(13,'Over the counter medicines','Non-prescription medicines'),(14,'eqwe','eqweq'),(15,'das','da'),(16,'q','e');
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
  `unit_type` enum('main','sub') DEFAULT 'sub',
  `unit_group` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`product_unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_units`
--

LOCK TABLES `product_units` WRITE;
/*!40000 ALTER TABLE `product_units` DISABLE KEYS */;
INSERT INTO `product_units` VALUES (1,4,'box of 10',10,'sub',NULL),(2,10,'piece',1,'sub',NULL),(3,10,'pack',4,'sub',NULL),(4,23,'piece',1,'sub',NULL),(5,24,'piece',1,'sub',NULL),(6,26,'piece',1,'sub',NULL),(7,31,'piece',1,'sub',NULL),(8,32,'Box',1,'sub',NULL),(9,34,'Piece',1,'sub',NULL),(10,35,'Box',1,'sub',NULL),(11,36,'Piece',1,'sub',NULL),(12,37,'Piece',1,'sub',NULL),(13,38,'Piece',1,'sub',NULL),(14,38,'Box',12,'sub',NULL),(15,14,'Piece',1,'sub',NULL),(16,14,'Piece',1,'sub',NULL),(17,14,'Piece',1,'sub',NULL),(18,14,'Box',12,'sub',NULL),(19,14,'Box',1,'sub',NULL),(20,19,'',1,'sub',NULL),(21,19,'Kilogram',1,'sub',NULL),(22,38,'Piece',1,'sub',NULL),(23,38,'Box',12,'sub',NULL),(24,39,'Piece',1,'sub',NULL),(25,18,'Piece',1,'sub',NULL);
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
  `sku` varchar(255) NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `unit_name` varchar(50) DEFAULT NULL,
  `model_number` varchar(100) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `warranty_period` int DEFAULT NULL,
  `tax_class` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_variant_id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `sku_2` (`sku`),
  KEY `fk_product_variants` (`product_id`),
  CONSTRAINT `fk_product_variants` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
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
  `brand_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `attributes` json DEFAULT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `description` text,
  `is_featured` tinyint DEFAULT '0',
  `tags` json DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `visibility` enum('public','private','archived') DEFAULT 'public',
  PRIMARY KEY (`product_id`),
  KEY `fk_supplier_idx` (`supplier_id`),
  KEY `fk_brand` (`brand_id`),
  CONSTRAINT `fk_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  CONSTRAINT `fk_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (49,10,7,'Reuh sample',11,'2025-08-13 06:54:53','2025-08-13 06:55:42',NULL,'http://localhost:81/uploads/1394290_1755068138.webp','active','dsdc',0,NULL,'dadasd','public');
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
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  `product_variant_id` int DEFAULT NULL,
  PRIMARY KEY (`retail_product_id`),
  KEY `product_id` (`product_id`),
  KEY `product_unit_id_idx` (`product_unit_id`),
  KEY `prod_var_id_p_idx` (`product_variant_id`),
  CONSTRAINT `prod_var_id_p` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`product_variant_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_unit_id` FOREIGN KEY (`product_unit_id`) REFERENCES `product_units` (`product_unit_id`),
  CONSTRAINT `retail_products_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retail_products`
--

LOCK TABLES `retail_products` WRITE;
/*!40000 ALTER TABLE `retail_products` DISABLE KEYS */;
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
  CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_details`
--

LOCK TABLES `sale_details` WRITE;
/*!40000 ALTER TABLE `sale_details` DISABLE KEYS */;
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
INSERT INTO `sales` VALUES (64,'2025-04-26 03:02:43',99.49,'Cash',12),(65,'2025-04-26 03:03:52',99.49,'Cash',12),(66,'2025-04-26 03:40:06',59.99,'Cash',12),(67,'2025-04-26 03:47:07',39.99,'Cash',12),(68,'2025-04-26 03:47:52',186.96,'Cash',12),(69,'2025-04-26 03:48:59',173.93,'Cash',12),(70,'2025-04-26 04:08:42',316.95,'Cash',12),(71,'2025-04-26 05:42:58',134.49,'Cash',12),(72,'2025-04-26 06:22:03',93.49,'Cash',12);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_zones`
--

DROP TABLE IF EXISTS `storage_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_zones` (
  `storage_zone_id` int NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(100) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`storage_zone_id`),
  UNIQUE KEY `zone_name` (`zone_name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_zones`
--

LOCK TABLES `storage_zones` WRITE;
/*!40000 ALTER TABLE `storage_zones` DISABLE KEYS */;
INSERT INTO `storage_zones` VALUES (1,'Cold Storage',NULL,1,'2025-07-20 22:23:35'),(2,'Bulk Storage',NULL,1,'2025-07-20 22:23:35'),(3,'Fast Pick',NULL,1,'2025-07-20 22:23:35'),(4,'Returns',NULL,1,'2025-07-20 22:23:35'),(5,'Quarantine',NULL,1,'2025-07-20 22:23:35'),(6,'Damaged Area',NULL,1,'2025-07-20 22:23:35'),(7,'Staging Zone',NULL,1,'2025-07-20 22:23:35'),(8,'Hazmat Zone',NULL,1,'2025-07-20 22:23:35'),(9,'High Value',NULL,1,'2025-07-20 22:23:35'),(10,'Overflow',NULL,1,'2025-07-20 22:23:35'),(11,'Ambient Shelf',NULL,1,'2025-07-20 22:23:35');
/*!40000 ALTER TABLE `storage_zones` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (2,'TechSource Inc.','Alice Johnson','+1-800-555-1234','alice@techsource.com','123 Silicon Ave, San Jose, CA 9513','United States'),(3,'HomeComfort Appliances','Mark Chen','+86-21-8888-9999','mark.chen@homecomfort.cn','56 Nanjing Road, Shanghai','China'),(4,'Urban Living Furniture','Sofia Ramirez','+34-91-123-4567','sofia@urbanliving.es','Calle de Alcalá, 123, Madrid','Spain'),(5,'Sportopia Gear','Liam O\'Connor','+353-1-456-7890','liam@sportopia.ie','10 Riverwalk, Dublin','Ireland'),(6,'BeautyBloom Co.','Hannah Kim','+82-2-1234-5678','hannah.kim@beautybloom.kr','789 Gangnam-daero, Seoul','South Korea'),(7,'BookNest Distributors','Daniel Smith','+44-20-1234-5678','daniel@booknest.co.uk','45 Oxford Street, London','United Kingdom'),(8,'ToyGalaxy Ltd.','Aiko Tanaka','+81-3-1234-5678','aiko.t@toygalaxy.jp','1-2-3 Harajuku, Shibuya-ku, Tokyo','Japan'),(9,'FreshFarm Wholesale','Pedro Morales','+52-55-8765-4321','pedro@freshfarm.mx','Av. Insurgentes Sur 5000, Mexico City','Mexico'),(10,'AutoMax Parts Supply','John Williams','+1-312-555-6789','jwilliams@automax.com','1500 W Madison St, Chicago, IL 60607','United States'),(11,'NordicTech Components','Ingrid Olsen','+47-22-345-678','ingrid@nordictech.no','Storgata 45, Oslo','Norway'),(12,'MedLife Pharmaceuticals',NULL,'+63 912 345 6789','contact@medlifepharma.com','Unit 2B, Wellness Building, Quezon Ave., Quezon City, Metro Manila, Philippines',NULL),(13,'weq',NULL,'eqwe','ewq','eqw',NULL),(14,'weq',NULL,'rewr','rew','rew',NULL),(15,'dasd',NULL,'dasda','dasda','dasda',NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_kuma`
--

DROP TABLE IF EXISTS `transaction_kuma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_kuma` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(100) NOT NULL,
  `round_id` varchar(100) NOT NULL,
  `provider_transaction_id` varchar(100) NOT NULL,
  `provider_round_id` varchar(100) DEFAULT NULL,
  `amount` decimal(13,4) DEFAULT NULL,
  `transaction_type` smallint DEFAULT NULL,
  `round_completed` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `operator_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `player_id` int DEFAULT NULL,
  `sub_provider_id` int DEFAULT NULL,
  `game_id` int DEFAULT NULL,
  `transaction_status` varchar(45) DEFAULT NULL,
  `freeroundid` varchar(100) DEFAULT '',
  PRIMARY KEY (`created_at`,`transaction_id`),
  UNIQUE KEY `id_transaction_id_provider_transaction_id_created_at` (`id`,`created_at`),
  KEY `transaction_id` (`transaction_id`),
  KEY `provider_transaction_id` (`provider_transaction_id`),
  KEY `created_at` (`created_at`),
  KEY `operatorpergames` (`operator_id`,`client_id`,`sub_provider_id`,`game_id`,`player_id`),
  KEY `transaction_type` (`transaction_type`),
  KEY `round_id` (`round_id`),
  KEY `client_idx` (`client_id`),
  KEY `operator_idx` (`operator_id`) /*!80000 INVISIBLE */,
  KEY `player_id` (`player_id`) /*!80000 INVISIBLE */,
  KEY `provider_idx` (`sub_provider_id`) /*!80000 INVISIBLE */,
  KEY `game_idx` (`game_id`),
  KEY `round_id_op_cp_pl_idx` (`round_id`,`operator_id`,`client_id`,`player_id`,`sub_provider_id`,`game_id`,`created_at`),
  KEY `provider_round_id` (`provider_round_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6604996725 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE (unix_timestamp(`created_at`))
(PARTITION p20240701 VALUES LESS THAN (1719878400) ENGINE = InnoDB,
 PARTITION p20250301 VALUES LESS THAN (1740816000) ENGINE = InnoDB,
 PARTITION p20250302 VALUES LESS THAN (1740902400) ENGINE = InnoDB,
 PARTITION p20250303 VALUES LESS THAN (1740988800) ENGINE = InnoDB,
 PARTITION p20250304 VALUES LESS THAN (1741075200) ENGINE = InnoDB,
 PARTITION p20250305 VALUES LESS THAN (1741161600) ENGINE = InnoDB,
 PARTITION p20250306 VALUES LESS THAN (1741248000) ENGINE = InnoDB,
 PARTITION p20250307 VALUES LESS THAN (1741334400) ENGINE = InnoDB,
 PARTITION p20250308 VALUES LESS THAN (1741420800) ENGINE = InnoDB,
 PARTITION p20250309 VALUES LESS THAN (1741507200) ENGINE = InnoDB,
 PARTITION p20250310 VALUES LESS THAN (1741593600) ENGINE = InnoDB,
 PARTITION p20250311 VALUES LESS THAN (1741680000) ENGINE = InnoDB,
 PARTITION p20250312 VALUES LESS THAN (1741766400) ENGINE = InnoDB,
 PARTITION p20250313 VALUES LESS THAN (1741852800) ENGINE = InnoDB,
 PARTITION p20250314 VALUES LESS THAN (1741939200) ENGINE = InnoDB,
 PARTITION p20250315 VALUES LESS THAN (1742025600) ENGINE = InnoDB,
 PARTITION p20250316 VALUES LESS THAN (1742112000) ENGINE = InnoDB,
 PARTITION p20250317 VALUES LESS THAN (1742198400) ENGINE = InnoDB,
 PARTITION p20250318 VALUES LESS THAN (1742284800) ENGINE = InnoDB,
 PARTITION p20250319 VALUES LESS THAN (1742371200) ENGINE = InnoDB,
 PARTITION p20250320 VALUES LESS THAN (1742457600) ENGINE = InnoDB,
 PARTITION p20250321 VALUES LESS THAN (1742544000) ENGINE = InnoDB,
 PARTITION p20250322 VALUES LESS THAN (1742630400) ENGINE = InnoDB,
 PARTITION p20250323 VALUES LESS THAN (1742716800) ENGINE = InnoDB,
 PARTITION p20250324 VALUES LESS THAN (1742803200) ENGINE = InnoDB,
 PARTITION p20250325 VALUES LESS THAN (1742889600) ENGINE = InnoDB,
 PARTITION p20250326 VALUES LESS THAN (1742976000) ENGINE = InnoDB,
 PARTITION p20250327 VALUES LESS THAN (1743062400) ENGINE = InnoDB,
 PARTITION p20250328 VALUES LESS THAN (1743148800) ENGINE = InnoDB,
 PARTITION p20250329 VALUES LESS THAN (1743235200) ENGINE = InnoDB,
 PARTITION p20250330 VALUES LESS THAN (1743321600) ENGINE = InnoDB,
 PARTITION p20250331 VALUES LESS THAN (1743408000) ENGINE = InnoDB,
 PARTITION p20250401 VALUES LESS THAN (1743494400) ENGINE = InnoDB,
 PARTITION p20250402 VALUES LESS THAN (1743580800) ENGINE = InnoDB,
 PARTITION p20250403 VALUES LESS THAN (1743667200) ENGINE = InnoDB,
 PARTITION p20250404 VALUES LESS THAN (1743753600) ENGINE = InnoDB,
 PARTITION p20250405 VALUES LESS THAN (1743840000) ENGINE = InnoDB,
 PARTITION p20250406 VALUES LESS THAN (1743926400) ENGINE = InnoDB,
 PARTITION p20250407 VALUES LESS THAN (1744012800) ENGINE = InnoDB,
 PARTITION p20250408 VALUES LESS THAN (1744099200) ENGINE = InnoDB,
 PARTITION p20250409 VALUES LESS THAN (1744185600) ENGINE = InnoDB,
 PARTITION p20250410 VALUES LESS THAN (1744272000) ENGINE = InnoDB,
 PARTITION p20250411 VALUES LESS THAN (1744358400) ENGINE = InnoDB,
 PARTITION p20250412 VALUES LESS THAN (1744444800) ENGINE = InnoDB,
 PARTITION p20250413 VALUES LESS THAN (1744531200) ENGINE = InnoDB,
 PARTITION p20250414 VALUES LESS THAN (1744617600) ENGINE = InnoDB,
 PARTITION p20250415 VALUES LESS THAN (1744704000) ENGINE = InnoDB,
 PARTITION p20250416 VALUES LESS THAN (1744790400) ENGINE = InnoDB,
 PARTITION p20250417 VALUES LESS THAN (1744876800) ENGINE = InnoDB,
 PARTITION p20250418 VALUES LESS THAN (1744963200) ENGINE = InnoDB,
 PARTITION p20250419 VALUES LESS THAN (1745049600) ENGINE = InnoDB,
 PARTITION p20250420 VALUES LESS THAN (1745136000) ENGINE = InnoDB,
 PARTITION p20250421 VALUES LESS THAN (1745222400) ENGINE = InnoDB,
 PARTITION p20250422 VALUES LESS THAN (1745308800) ENGINE = InnoDB,
 PARTITION p20250423 VALUES LESS THAN (1745395200) ENGINE = InnoDB,
 PARTITION p20250424 VALUES LESS THAN (1745481600) ENGINE = InnoDB,
 PARTITION p20250425 VALUES LESS THAN (1745568000) ENGINE = InnoDB,
 PARTITION p20250426 VALUES LESS THAN (1745654400) ENGINE = InnoDB,
 PARTITION p20250427 VALUES LESS THAN (1745740800) ENGINE = InnoDB,
 PARTITION p20250428 VALUES LESS THAN (1745827200) ENGINE = InnoDB,
 PARTITION p20250429 VALUES LESS THAN (1745913600) ENGINE = InnoDB,
 PARTITION p20250430 VALUES LESS THAN (1746000000) ENGINE = InnoDB) */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_kuma`
--

LOCK TABLES `transaction_kuma` WRITE;
/*!40000 ALTER TABLE `transaction_kuma` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_kuma` ENABLE KEYS */;
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
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attribute_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`variant_attribute_id`),
  UNIQUE KEY `uq_variant_attr` (`product_variant_id`,`attribute_value_id`),
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
INSERT INTO `variant_attributes` VALUES (1,4,1,'2025-07-09 21:27:33',NULL),(2,5,4,'2025-07-09 21:27:33',NULL),(3,6,1,'2025-07-09 21:27:33',NULL),(4,7,4,'2025-07-09 21:27:33',NULL),(5,8,1,'2025-07-09 21:27:33',NULL),(6,3,1,'2025-07-09 21:27:33',NULL),(7,3,6,'2025-07-09 21:27:33',NULL),(8,3,15,'2025-07-09 21:27:33',NULL);
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
  `address` text NOT NULL,
  `capacity` int DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `capacity_unit` enum('units','kg','m3') DEFAULT 'units',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `business_id` int NOT NULL,
  PRIMARY KEY (`warehouse_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` VALUES (1,'Warehouse A','1234 Industrial Rd, Cityville',1000,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(2,'Warehouse B','5678 Commerce Blvd, Townsville',1500,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(3,'Warehouse C','91011 Distribution Ave, Metrocity',2000,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(4,'Warehouse D','1213 Storage Ln, Rivertown',800,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(5,'Warehouse E','1415 Supply St, Lakeside',1200,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(6,'Lamp Warehouse','Location F',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(7,'Rice Warehouse','Location G',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(8,'Seat Cover Warehouse','Location H',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(9,'Serum Warehouse','Location I',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(10,'Air Purifier Warehouse','Location J',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(11,'Chair Warehouse','Location K',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(12,'Toy Robot Warehouse','Location L',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0),(13,'CPU Cooler Warehouse','Location M',NULL,NULL,NULL,NULL,'units','2025-07-09 21:27:33','2025-07-09 21:27:33',0);
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

-- Dump completed on 2025-08-13 15:01:56
