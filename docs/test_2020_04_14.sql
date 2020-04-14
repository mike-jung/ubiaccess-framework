-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        5.7.17-log - MySQL Community Server (GPL)
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- test 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `test`;

-- 테이블 test.lion 구조 내보내기
CREATE TABLE IF NOT EXISTS `lion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `mobile` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- 테이블 데이터 test.lion:~21 rows (대략적) 내보내기
/*!40000 ALTER TABLE `lion` DISABLE KEYS */;
INSERT INTO `lion` (`id`, `name`, `mobile`) VALUES
	(1, 'john1', '010-1000-1000'),
	(2, 'john2', '010-1000-1000'),
	(3, 'john3', '010-1000-1000'),
	(4, 'john4', '010-1000-1000'),
	(5, 'john5', '010-1000-1000'),
	(6, 'john6', '010-1000-1000'),
	(7, 'john7', '010-1000-1000'),
	(8, 'john8', '010-1000-1000'),
	(9, 'john9', '010-1000-1000'),
	(10, 'john10', '010-1000-1000'),
	(11, 'john11', '010-1000-1000'),
	(12, 'john12', '010-1000-1000'),
	(13, 'john13', '010-1000-1000'),
	(14, 'john14', '010-1000-1000'),
	(15, 'john15', '010-1000-1000'),
	(16, 'john16', '010-1000-1000'),
	(17, 'john17', '010-1000-1000'),
	(18, 'john18', '010-1000-1000'),
	(19, 'john19', '010-1000-1000'),
	(20, 'john20', '010-1000-1000'),
	(21, 'john21', '010-1000-1000');
/*!40000 ALTER TABLE `lion` ENABLE KEYS */;

-- 테이블 test.person 구조 내보내기
CREATE TABLE IF NOT EXISTS `person` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `mobile` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- 테이블 데이터 test.person:~14 rows (대략적) 내보내기
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` (`id`, `name`, `age`, `mobile`) VALUES
	(9, '소녀시대1', 20, '010-1000-1000'),
	(10, '소녀시대2', 20, '010-2000-2000'),
	(11, '소녀시대3', 20, '010-3000-3000'),
	(12, '소녀시대4', 20, '010-4000-4000'),
	(13, '소녀시대5', 20, '010-5000-5000'),
	(14, '소녀시대6', 20, '010-6000-6000'),
	(15, '소녀시대7', 20, '010-7000-7000'),
	(16, '소녀시대8', 20, '010-8000-8000'),
	(17, '소녀시대9', 20, '010-9000-9000'),
	(19, '소녀시대11', 20, '010-3030-8887'),
	(20, '소녀시대12', 20, '010-3030-8887'),
	(21, '소녀시대13', 20, '010-3030-8887'),
	(22, '홍길동1', 20, '010-4999-4822'),
	(23, '홍길동2', 20, '010-4999-4822');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
