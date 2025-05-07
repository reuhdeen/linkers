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

-- Dump completed on 2025-04-26 14:36:47
