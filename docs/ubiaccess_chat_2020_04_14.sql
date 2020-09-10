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


-- chat 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `chat` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `chat`;

-- 테이블 chat.connection 구조 내보내기
CREATE TABLE IF NOT EXISTS `connection` (
  `socket_id` text COMMENT 'socket id',
  `namespace` text COMMENT 'namespace',
  `id` text COMMENT 'id',
  `alias` text COMMENT 'alias',
  `today` text COMMENT 'today message',
  `presence` varchar(16) DEFAULT NULL COMMENT 'presence (on, off)',
  `disconnect_date` datetime DEFAULT NULL COMMENT '연결종료일시',
  `login_date` datetime DEFAULT NULL COMMENT '로그인일시',
  `logout_date` datetime DEFAULT NULL COMMENT '로그아웃일시',
  `presence_date` datetime DEFAULT NULL COMMENT '프레즌스업데이트일시',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 chat.connection:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `connection` DISABLE KEYS */;
/*!40000 ALTER TABLE `connection` ENABLE KEYS */;

-- 테이블 chat.contacts 구조 내보내기
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` text COMMENT 'id',
  `buddy_id` text COMMENT 'buddy''s id',
  `buddy_group` text COMMENT 'buddy''s group',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 chat.contacts:~2 rows (대략적) 내보내기
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` (`id`, `buddy_id`, `buddy_group`, `create_date`, `modify_date`) VALUES
	('test01', 'test02', 'friends', '2019-06-10 23:02:46', '2019-06-10 23:02:46'),
	('test02', 'test01', 'friends', '2019-06-10 23:02:46', '2019-06-10 23:02:46');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;

-- 테이블 chat.message 구조 내보내기
CREATE TABLE IF NOT EXISTS `message` (
  `id` text COMMENT 'request code',
  `sender` text COMMENT 'sender',
  `receiver` text COMMENT 'recipient',
  `command` varchar(16) DEFAULT NULL COMMENT 'command (chat, ...)',
  `type` varchar(16) DEFAULT NULL COMMENT 'type (text, ...)',
  `namespace` text COMMENT 'namespace',
  `data` text COMMENT 'contents',
  `status` varchar(16) DEFAULT NULL COMMENT 'status (init, success, fail)',
  `details` text COMMENT 'details',
  `sent_date` datetime DEFAULT NULL COMMENT '전송일시',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 chat.message:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;

-- 테이블 chat.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` text COMMENT 'id',
  `name` text COMMENT 'name',
  `mac` text COMMENT 'MAC address',
  `password` text COMMENT 'password',
  `group` text COMMENT 'group',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 chat.users:~1 rows (대략적) 내보내기
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `mac`, `password`, `group`, `create_date`, `modify_date`) VALUES
	('test01', 'John', NULL, '123456', NULL, '2019-06-10 22:00:41', '2019-06-10 22:00:47'),
	('test02', 'Mike', NULL, '123456', NULL, '2019-06-10 22:00:41', '2019-06-10 22:00:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
