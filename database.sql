-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.2.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for gomoku
CREATE DATABASE IF NOT EXISTS `gomoku` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `gomoku`;

-- Dumping structure for table gomoku.friends
CREATE TABLE IF NOT EXISTS `friends` (
  `first-id` int(11) NOT NULL,
  `second-id` int(11) NOT NULL,
  KEY `FK__users` (`first-id`),
  KEY `FK__users_2` (`second-id`),
  CONSTRAINT `FK__users` FOREIGN KEY (`first-id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK__users_2` FOREIGN KEY (`second-id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table gomoku.friends: ~5 rows (approximately)
DELETE FROM `friends`;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` (`first-id`, `second-id`) VALUES
	(1, 2),
	(1, 3),
	(2, 5),
	(4, 7),
	(3, 5);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;

-- Dumping structure for table gomoku.games
CREATE TABLE IF NOT EXISTS `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first-player-id` int(11) NOT NULL,
  `second-player-id` int(11) NOT NULL,
  `gamestate` varchar(225) NOT NULL DEFAULT '0xx00xx0x',
  `winner-id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_games_users` (`first-player-id`),
  KEY `FK_games_users_2` (`second-player-id`),
  KEY `FK_games_users_3` (`winner-id`),
  CONSTRAINT `FK_games_users` FOREIGN KEY (`first-player-id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_games_users_2` FOREIGN KEY (`second-player-id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_games_users_3` FOREIGN KEY (`winner-id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table gomoku.games: ~3 rows (approximately)
DELETE FROM `games`;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` (`id`, `first-player-id`, `second-player-id`, `gamestate`, `winner-id`) VALUES
	(1, 1, 2, '0xx00xx0x', NULL),
	(2, 1, 3, '0xx00xx0x', 1),
	(3, 1, 2, '0xx00xx0x', 2);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;

-- Dumping structure for table gomoku.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL DEFAULT 'password',
  `name` varchar(50) NOT NULL DEFAULT 'name',
  `surname` varchar(50) NOT NULL DEFAULT 'surname',
  `won-games` int(11) NOT NULL DEFAULT 0,
  `lost-games` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Dumping data for table gomoku.users: ~6 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `login`, `password`, `name`, `surname`, `won-games`, `lost-games`) VALUES
	(1, 'mail@mail.ru', 'login1', 'pass', 'name', 'sur', 0, 0),
	(2, 'mail2@mail.ru', 'login2', 'pass', 'name', 'sur', 0, 0),
	(3, 'mail3@mail.ru', 'login3', 'password', 'name', 'surname', 0, 0),
	(4, 'mail4@mail.ru', 'login4', 'password', 'name', 'surname', 0, 0),
	(5, 'mail5@mail.ru', 'login5', 'password', 'name', 'surname', 0, 0),
	(7, 'mail6@mail.ru', 'login6', 'password', 'name', 'surname', 0, 0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
