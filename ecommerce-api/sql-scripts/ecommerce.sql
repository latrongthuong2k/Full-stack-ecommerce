-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 127.0.0.1    Database: ecommerce-test-db
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category`
(
    `category_id`   bigint       NOT NULL AUTO_INCREMENT,
    `category_name` varchar(100) NOT NULL,
    `description`   varchar(255) NOT NULL,
    `status`        varchar(255) NOT NULL,
    PRIMARY KEY (`category_id`),
    UNIQUE KEY `uc_category_category_name` (`category_name`),
    UNIQUE KEY `uc_category_description` (`description`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `category`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details`
(
    `order_id`       bigint         NOT NULL,
    `product_id`     bigint         NOT NULL,
    `product_name`   varchar(100)   NOT NULL,
    `unit_price`     decimal(10, 2) NOT NULL,
    `order_quantity` int            NOT NULL,
    PRIMARY KEY (`order_id`),
    KEY `FK_ORDER_DETAILS_ON_PRODUCT` (`product_id`),
    CONSTRAINT `FK_ORDER_DETAILS_ON_ORDER` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
    CONSTRAINT `FK_ORDER_DETAILS_ON_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders`
(
    `order_id`        bigint       NOT NULL AUTO_INCREMENT,
    `serial_number`   varchar(255) NOT NULL,
    `order_at`        datetime     NOT NULL,
    `user_id`         bigint       NOT NULL,
    `total_price`     decimal(10, 2)                                                    DEFAULT NULL,
    `status`          enum ('WAITING','CONFIRM','DELIVERY','SUCCESS','CANCEL','DENIED') DEFAULT NULL,
    `note`            varchar(100)                                                      DEFAULT NULL,
    `receive_name`    varchar(100)                                                      DEFAULT NULL,
    `receive_address` varchar(255)                                                      DEFAULT NULL,
    `receive_phone`   varchar(15)                                                       DEFAULT NULL,
    `created_at`      datetime                                                          DEFAULT NULL,
    `received_at`     datetime                                                          DEFAULT NULL,
    PRIMARY KEY (`order_id`),
    UNIQUE KEY `uc_orders_serial_number` (`serial_number`),
    KEY `FK_ORDERS_ON_USER` (`user_id`),
    CONSTRAINT `FK_ORDERS_ON_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `orders`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productIds`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products`
(
    `product_id`       bigint         NOT NULL AUTO_INCREMENT,
    `sku`              varchar(255)   NOT NULL,
    `product_name`     varchar(50)    NOT NULL,
    `description`      varchar(255) DEFAULT NULL,
    `unit_price`       decimal(10, 2) NOT NULL,
    `stock_quantity`   int            NOT NULL,
    `category_id`      bigint       DEFAULT NULL,
    `image_url`        varchar(255) DEFAULT NULL,
    `created_at`       datetime(6)    NOT NULL,
    `updated_at`       datetime(6)  DEFAULT NULL,
    `created_by`       bigint         NOT NULL,
    `last_modified_by` bigint       DEFAULT NULL,
    `status`           bit(1)         NOT NULL,
    PRIMARY KEY (`product_id`),
    UNIQUE KEY `uc_products_sku` (`sku`),
    KEY `FK_PRODUCTS_ON_CATEGORY` (`category_id`),
    CONSTRAINT `FK_PRODUCTS_ON_CATEGORY` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
    CONSTRAINT `check_zero` CHECK ((`stock_quantity` > 0))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productIds`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `products`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_cart`
(
    `shoping_cart_id` bigint NOT NULL AUTO_INCREMENT,
    `product_id`      bigint NOT NULL,
    `user_id`         bigint NOT NULL,
    `order_quantity`  int    NOT NULL,
    PRIMARY KEY (`shoping_cart_id`),
    UNIQUE KEY `uc_shopping_cart_product` (`product_id`),
    UNIQUE KEY `uc_shopping_cart_user` (`user_id`),
    CONSTRAINT `FK_SHOPPING_CART_ON_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
    CONSTRAINT `FK_SHOPPING_CART_ON_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `shopping_cart`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token`
(
    `id`         int    NOT NULL AUTO_INCREMENT,
    `token`      varchar(255)    DEFAULT NULL,
    `token_type` enum ('BEARER') DEFAULT NULL,
    `revoked`    bit(1) NOT NULL,
    `expired`    bit(1) NOT NULL,
    `user_id`    bigint          DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uc_token_token` (`token`),
    KEY `FK_TOKEN_ON_USER` (`user_id`),
    CONSTRAINT `FK_TOKEN_ON_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `token`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address`
(
    `address_id`   bigint       NOT NULL AUTO_INCREMENT,
    `user_id`      bigint       NOT NULL,
    `full_address` varchar(255) NOT NULL,
    `phone`        varchar(15)  NOT NULL,
    `receive_name` varchar(50)  NOT NULL,
    PRIMARY KEY (`address_id`),
    UNIQUE KEY `uc_user_address_phone` (`phone`),
    UNIQUE KEY `uc_user_address_user` (`user_id`),
    CONSTRAINT `FK_USER_ADDRESS_ON_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `user_address`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_images`
--

DROP TABLE IF EXISTS `user_images`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_images`
(
    `id`             int          NOT NULL AUTO_INCREMENT,
    `user_image_key` varchar(255) NOT NULL,
    `user_id`        bigint       NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uc_user_images_user` (`user_id`),
    CONSTRAINT `USER_ID_IMAGE_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_images`
--

LOCK TABLES `user_images` WRITE;
/*!40000 ALTER TABLE `user_images`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `user_images`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users`
(
    `user_id`    bigint                NOT NULL AUTO_INCREMENT,
    `user_name`  varchar(100)          NOT NULL,
    `email`      varchar(255)          NOT NULL,
    `full_name`  varchar(100)          NOT NULL,
    `password`   varchar(255)          NOT NULL,
    `avatar`     varchar(255) DEFAULT NULL,
    `phone`      varchar(15)  DEFAULT NULL,
    `created_at` datetime(6)           NOT NULL,
    `update_at`  datetime(6)  DEFAULT NULL,
    `status`     bit(1)                NOT NULL,
    `role`       enum ('ADMIN','USER') NOT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uc_users_email` (`email`),
    UNIQUE KEY `uc_users_password` (`password`),
    UNIQUE KEY `uc_users_user_name` (`user_name`),
    UNIQUE KEY `uc_users_phone` (`phone`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `users`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_list`
--

DROP TABLE IF EXISTS `wish_list`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_list`
(
    `wish_list_id` bigint NOT NULL AUTO_INCREMENT,
    `user_id`      bigint NOT NULL,
    `product_id`   bigint NOT NULL,
    PRIMARY KEY (`wish_list_id`),
    UNIQUE KEY `uc_wish_list_product` (`product_id`),
    UNIQUE KEY `uc_wish_list_user` (`user_id`),
    CONSTRAINT `FK_WISH_LIST_ON_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
    CONSTRAINT `FK_WISH_LIST_ON_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_list`
--

LOCK TABLES `wish_list` WRITE;
/*!40000 ALTER TABLE `wish_list`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_list`
    ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE = @OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;

-- Dump completed on 2023-12-19  2:30:17
