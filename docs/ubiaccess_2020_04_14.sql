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


-- ubiaccess 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `ubiaccess` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ubiaccess`;

-- 테이블 ubiaccess.database 구조 내보내기
CREATE TABLE IF NOT EXISTS `database` (
  `id` varchar(16) NOT NULL COMMENT '데이터베이스 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '데이터베이스 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '데이터베이스 설명',
  `use_yn` varchar(1) DEFAULT 'Y' COMMENT '사용 여부 (Y, N)',
  `db_type` varchar(8) DEFAULT NULL COMMENT '데이터베이스 유형 (mysql, oracle)',
  `db_url` text COMMENT 'DB URL',
  `db_username` varchar(32) DEFAULT NULL COMMENT 'DB username',
  `db_password` varchar(32) DEFAULT NULL COMMENT 'DB password',
  `debug_yn` varchar(1) DEFAULT NULL COMMENT '디버그 여부 (Y, N)',
  `conn_limit` int(11) DEFAULT '10' COMMENT '기본 연결수 (10)',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='데이터베이스 설정';

-- 테이블 데이터 ubiaccess.database:~1 rows (대략적) 내보내기
/*!40000 ALTER TABLE `database` DISABLE KEYS */;
INSERT INTO `database` (`id`, `name`, `details`, `use_yn`, `db_type`, `db_url`, `db_username`, `db_password`, `debug_yn`, `conn_limit`, `create_date`, `modify_date`, `create_id`, `modify_id`) VALUES
	('1', 'main DB', '기본 접속 DB', 'Y', 'mysql', 'jdbc:mysql://127.0.0.1:3306/medical', 'root', 'admin', 'N', 10, '2018-11-05 13:27:48', '2018-11-05 13:27:48', NULL, NULL);
/*!40000 ALTER TABLE `database` ENABLE KEYS */;

-- 테이블 ubiaccess.database_sql 구조 내보내기
CREATE TABLE IF NOT EXISTS `database_sql` (
  `id` varchar(16) NOT NULL COMMENT '데이터베이스 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '데이터베이스 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '데이터베이스 설명',
  `use_yn` varchar(1) DEFAULT 'Y' COMMENT '사용 여부 (Y, N)',
  `contents` text COMMENT 'SQL 내용',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='데이터베이스 SQL 설정';

-- 테이블 데이터 ubiaccess.database_sql:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `database_sql` DISABLE KEYS */;
/*!40000 ALTER TABLE `database_sql` ENABLE KEYS */;

-- 테이블 ubiaccess.device 구조 내보내기
CREATE TABLE IF NOT EXISTS `device` (
  `_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `id` varchar(50) DEFAULT NULL COMMENT '단말 ID',
  `name` varchar(50) DEFAULT NULL COMMENT '단말 이름',
  `type` varchar(16) DEFAULT NULL COMMENT '단말 유형 (pc, tablet, phone)',
  `group_id` varchar(50) DEFAULT NULL COMMENT '단말 그룹 ID',
  `mac` varchar(24) DEFAULT NULL COMMENT 'MAC 주소',
  `ip` varchar(24) DEFAULT NULL COMMENT 'IP 주소',
  `mobile` varchar(24) DEFAULT NULL COMMENT '전화번호',
  `ostype` varchar(8) DEFAULT NULL COMMENT 'OS명',
  `osversion` varchar(16) DEFAULT NULL COMMENT 'OS 버전',
  `manufacturer` varchar(16) DEFAULT NULL COMMENT '제조사',
  `model` text COMMENT '모델명',
  `display` varchar(16) DEFAULT NULL COMMENT '디스플레이',
  `extra1` text COMMENT '추가 키 값 1',
  `extra2` text COMMENT '추가 키 값 2',
  `extra3` text COMMENT '추가 키 값 3',
  `access` varchar(16) DEFAULT NULL COMMENT '접근가능여부 (public, private)',
  `permission` varchar(16) DEFAULT NULL COMMENT '접근권한 (normal, blocked, password)',
  `regid` text COMMENT '구글 push 등록 ID',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`_id`),
  KEY `id` (`id`),
  KEY `group_id` (`group_id`),
  KEY `name` (`name`),
  KEY `mac` (`mac`),
  KEY `ip` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='단말정보';

-- 테이블 데이터 ubiaccess.device:~5 rows (대략적) 내보내기
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` (`_id`, `id`, `name`, `type`, `group_id`, `mac`, `ip`, `mobile`, `ostype`, `osversion`, `manufacturer`, `model`, `display`, `extra1`, `extra2`, `extra3`, `access`, `permission`, `regid`, `create_date`, `modify_date`) VALUES
	(1, 'A_001_001', '건진PC_001', 'pc', 'G_001', 'a1:47:c9:78:b3:a9', '116.2.20.81', '', 'Windows', '10', '', '', '', NULL, NULL, NULL, 'private', 'blocked', 'c0qoFTJoIJI:APA91bGJTNTdgGX4ndfdA7oFdEQymTmSkxeIWFmmKmqvxcapyirCN6v9khHvtHGkiS1G9AG2TIMpOf-_QhJf5DHThkocG6mZ1_xLA3ACaE_QH-srHtEbAJCk7ENRMeEczWVvaQIICS9F', '2017-05-26 08:55:16', '2017-05-26 08:55:22'),
	(2, 'A_001_002', '건진탭_001', 'tablet', 'G_001', 'e2:97:a7:23:08:c9', '116.2.20.82', '', 'Android', '9.1', 'Samsung', '', '1800x1200', NULL, NULL, NULL, 'private', 'normal', 'c0qoFTJoIJI:APA91bGJTNTdgGX4ndfdA7oFdEQymTmSkxeIWFmmKmqvxcapyirCN6v9khHvtHGkiS1G9AG2TIMpOf-_QhJf5DHThkocG6mZ1_xLA3ACaE_QH-srHtEbAJCk7ENRMeEczWVvaQIICS9F', '2017-05-27 11:34:56', '2017-05-27 11:34:56'),
	(3, 'A_001_003', '건진폰_001', 'phone', 'G_001', 'd1:26:c3:81:a5:b1', '116.2.20.83', '821036652222', 'Android', '7.1.1', 'LG', 'G3-400', '1800x1200', 'HC_ROOM_3', NULL, NULL, 'private', 'normal', 'c0qoFTJoIJI:APA91bGJTNTdgGX4ndfdA7oFdEQymTmSkxeIWFmmKmqvxcapyirCN6v9khHvtHGkiS1G9AG2TIMpOf-_QhJf5DHThkocG6mZ1_xLA3ACaE_QH-srHtEbAJCk7ENRMeEczWVvaQIICS9F', '2017-05-27 11:34:56', '2017-05-27 11:34:56'),
	(7, 'A_002_001', 'TestDevice1', 'phone', 'G_001', '02:15:B2:00:00:00', '10.0.2.16', '+15555215554', 'Android', '10', 'Google', 'Android SDK built for x86', '1080x1794', 'HC_ROOM_1', NULL, NULL, '', '', 'dNv2VWVxDHU:APA91bFwdVYW0qOb7iqRh1m6sB8CSUQT5AMo2V9ezmLM2H8gq6P1T_JUr8hb5vfNTeh0-J1AMsJ5e1ETIT84f5KaOA4zBPd4BHA_zk15XSY9yO4ie0HbeONozUPXZb5F_AnD53YqMPx1', '2020-02-10 18:38:25', '2020-02-13 17:47:01'),
	(8, 'A_002_002', '내 탭 1', 'phone', 'G_001', 'F4:42:8F:38:BE:B5', '172.20.10.2', '', 'Android', '7.0', 'samsung', 'SM-T715N0', '1536x2048', 'HC_ROOM_2', NULL, NULL, '', '', 'dp8KeivcQeQ:APA91bEyKB1K1-cgLQM3LMuUip7QQ2MSDgalIdGdPMdVq9HxiiWC0sQra1J62z5NQjCTJq1adulOCYKn_o_88zuGXb9IEUEvnTV8k3yvfztwbxqA1fHVnfNbnzymbXHVVP2ddsXO0hlL', '2020-02-10 18:41:43', '2020-04-09 13:02:39');
/*!40000 ALTER TABLE `device` ENABLE KEYS */;

-- 테이블 ubiaccess.device_group 구조 내보내기
CREATE TABLE IF NOT EXISTS `device_group` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` varchar(50) DEFAULT NULL COMMENT '단말 그룹 ID',
  `group_name` text COMMENT '단말 그룹 이름',
  `parent` text COMMENT '부모 그룹 ID',
  `details` text COMMENT '상세',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='단말 그룹';

-- 테이블 데이터 ubiaccess.device_group:~4 rows (대략적) 내보내기
/*!40000 ALTER TABLE `device_group` DISABLE KEYS */;
INSERT INTO `device_group` (`_id`, `group_id`, `group_name`, `parent`, `details`, `create_date`, `modify_date`) VALUES
	(1, 'G_001', '센터', 'ROOT', '그룹 1', '2017-05-26 08:56:41', '2017-05-26 08:56:42'),
	(3, 'G_ROOT', 'G_ROOT', NULL, '루트', '2017-05-26 08:58:17', '2017-05-26 08:58:19'),
	(7, 'G_20200210153717210001', '일반', 'ROOT', '일반진료과', '2020-02-10 15:37:20', '2020-02-10 15:37:20'),
	(8, 'G_20200331152650344001', '테스트그룹', 'ROOT', '테스트그룹', '2020-03-31 15:26:48', '2020-03-31 15:26:48');
/*!40000 ALTER TABLE `device_group` ENABLE KEYS */;

-- 테이블 ubiaccess.device_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `device_user` (
  `_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `device_id` varchar(50) DEFAULT NULL COMMENT '단말 ID',
  `user_id` varchar(50) DEFAULT NULL COMMENT '사용자 ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '사용자 이름',
  `group_id` varchar(50) DEFAULT NULL COMMENT '사용자 ID',
  `group_name` text COMMENT '사용자 이름',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`_id`),
  KEY `device_id` (`device_id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='단말 사용자';

-- 테이블 데이터 ubiaccess.device_user:~6 rows (대략적) 내보내기
/*!40000 ALTER TABLE `device_user` DISABLE KEYS */;
INSERT INTO `device_user` (`_id`, `device_id`, `user_id`, `user_name`, `group_id`, `group_name`, `create_date`, `modify_date`) VALUES
	(1, 'A_001_001', '102010', '김준수', 'GS', '외과', '2017-05-26 16:27:31', '2017-05-26 16:27:32'),
	(3, 'A_001_001', '801010', '김희연', 'GS', '외과', '2017-05-27 13:05:28', '2017-05-27 13:05:28'),
	(4, 'A_001_002', '103010', '박현철', 'GS', '외과', '2017-05-27 13:29:34', '2017-05-27 13:29:34'),
	(5, 'A_001_002', '101010', '이영수', 'DER', '피부과', '2017-05-30 13:10:49', '2017-05-30 13:10:49'),
	(8, 'A_002_001', '104010', 'john', 'GS', 'GS', '2020-02-12 12:58:49', '2020-02-12 12:58:49'),
	(10, 'A_002_001', '102010', '김준수', 'GS', 'surgery', '2020-02-12 13:03:28', '2020-02-12 13:03:28');
/*!40000 ALTER TABLE `device_user` ENABLE KEYS */;

-- 테이블 ubiaccess.external 구조 내보내기
CREATE TABLE IF NOT EXISTS `external` (
  `id` varchar(16) NOT NULL COMMENT '외부연동 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '외부연동 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '외부연동 설명',
  `use_yn` varchar(1) DEFAULT 'Y' COMMENT '사용 여부 (Y, N)',
  `file` varchar(32) DEFAULT NULL COMMENT '파일명',
  `protocol` varchar(8) DEFAULT NULL COMMENT '프로토콜 이름 (socket, http)',
  `direction` varchar(8) DEFAULT NULL COMMENT '연동방향 (inbound, outbound)',
  `host` varchar(32) DEFAULT NULL COMMENT '서버 IP (127.0.0.1)',
  `port` int(11) DEFAULT NULL COMMENT '서버 Port (7001)',
  `server_type` varchar(4) DEFAULT NULL COMMENT '서버 유형 (운영 : P, 이관 : T, 개발 : D)',
  `conn_limit` int(11) DEFAULT NULL COMMENT '기본 연결수 (10)',
  `conn_timeout` int(11) DEFAULT NULL COMMENT '연결 타임아웃 (10000)',
  `acquire_timeout` int(11) DEFAULT NULL COMMENT '연결승인 타임아웃 (10000)',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='외부 연동 설정';

-- 테이블 데이터 ubiaccess.external:~3 rows (대략적) 내보내기
/*!40000 ALTER TABLE `external` DISABLE KEYS */;
INSERT INTO `external` (`id`, `name`, `details`, `use_yn`, `file`, `protocol`, `direction`, `host`, `port`, `server_type`, `conn_limit`, `conn_timeout`, `acquire_timeout`, `create_date`, `modify_date`, `create_id`, `modify_id`) VALUES
	('0', 'external01', '외부연동 01', 'Y', 'mci', 'socket', 'outbound', '127.0.0.1', 7001, 'T', 10, 10000, 10000, '2018-11-05 13:39:41', '2018-11-05 13:39:42', NULL, NULL),
	('1', 'external02', '외부연동 02', NULL, NULL, 'socket', 'inbound', NULL, 7002, NULL, NULL, NULL, NULL, '2018-11-05 13:41:51', '2018-11-05 13:41:51', NULL, NULL),
	('smc', 'external03', '외부연동 03', 'Y', 'chis_eai', 'http', 'outbound', '172.20.10.4', 7003, NULL, NULL, NULL, NULL, '2018-11-05 13:42:55', '2018-11-05 13:42:55', NULL, NULL);
/*!40000 ALTER TABLE `external` ENABLE KEYS */;

-- 테이블 ubiaccess.external_controller 구조 내보내기
CREATE TABLE IF NOT EXISTS `external_controller` (
  `id` varchar(16) NOT NULL COMMENT '콘트롤러 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '콘트롤러 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '콘트롤러 설명',
  `use_yn` varchar(1) DEFAULT 'Y' COMMENT '사용 여부 (Y, N)',
  `parent_id` varchar(16) DEFAULT NULL COMMENT '이 콘트롤러가 속한 서버 ID',
  `method` varchar(64) DEFAULT NULL COMMENT '실행 함수명 (ex. inpatient_list)',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='외부연동 콘트롤러';

-- 테이블 데이터 ubiaccess.external_controller:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `external_controller` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_controller` ENABLE KEYS */;

-- 테이블 ubiaccess.external_controller_param 구조 내보내기
CREATE TABLE IF NOT EXISTS `external_controller_param` (
  `id` varchar(16) NOT NULL COMMENT '파라미터 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '파라미터 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '파라미터 설명',
  `parent_id` varchar(16) DEFAULT NULL COMMENT '이 파라미터가 속한 콘트롤러 ID',
  `param_type` varchar(8) DEFAULT NULL COMMENT '파라미터 타입 (single, tuple)',
  `param_name` varchar(64) DEFAULT NULL COMMENT '파라미터 이름 (single일 경우에는 값만 있음)',
  `param_value` varchar(64) DEFAULT NULL COMMENT '파라미터 값 (single일 경우에는 값만 있음)',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='외부연동 콘트롤러를 위한 파라미터';

-- 테이블 데이터 ubiaccess.external_controller_param:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `external_controller_param` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_controller_param` ENABLE KEYS */;

-- 테이블 ubiaccess.push_mapping 구조 내보내기
CREATE TABLE IF NOT EXISTS `push_mapping` (
  `_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `name` text COMMENT '매핑 이름',
  `sender` varchar(50) DEFAULT NULL COMMENT '송신단말',
  `receiver` varchar(50) DEFAULT NULL COMMENT '수신단말',
  `sender_name` text COMMENT '송신단말',
  `receiver_name` text COMMENT '수신단말',
  `sender_key` text COMMENT '송신단말 키',
  `receiver_key` text COMMENT '수신단말 키',
  `key_column` text COMMENT '키 칼럼 이름 (IP',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`_id`),
  KEY `sender` (`sender`),
  KEY `receiver` (`receiver`),
  KEY `create_date` (`create_date`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- 테이블 데이터 ubiaccess.push_mapping:~5 rows (대략적) 내보내기
/*!40000 ALTER TABLE `push_mapping` DISABLE KEYS */;
INSERT INTO `push_mapping` (`_id`, `name`, `sender`, `receiver`, `sender_name`, `receiver_name`, `sender_key`, `receiver_key`, `key_column`, `create_date`, `modify_date`) VALUES
	(1, '건진PC_001 → 건진탭_001', 'A_001_001', 'A_002_001', '건진PC_001', '예건폰_001', '116.2.20.81', '192.168.0.22', 'ip', '2020-02-06 15:00:27', '2020-02-06 15:00:27'),
	(10, '푸시1', 'A_001_001', 'A_002_001', '건진PC_001', '116.2.20.81', 'TestDevice1', '10.0.2.16', 'ip', '2020-02-14 12:18:42', '2020-02-14 12:18:42'),
	(11, 'test2', 'A_001_001', 'A_001_003', '건진PC_001', '건진폰_001', '116.2.20.81', '116.2.20.83', 'ip', '2020-03-31 16:05:15', '2020-03-31 16:05:15'),
	(13, '테스트3', 'A_001_001', 'A_002_002', '건진PC_001', '건진폰_001', '116.2.20.81', '116.2.20.83', 'ip', '2020-04-02 13:56:03', '2020-04-02 13:56:03'),
	(14, '테스트2', 'A_001_001', 'A_001_003', '건진PC_001', '건진폰_001', '116.2.20.81', '116.2.20.83', 'ip', '2020-04-09 10:26:03', '2020-04-09 10:26:03');
/*!40000 ALTER TABLE `push_mapping` ENABLE KEYS */;

-- 테이블 ubiaccess.push_request 구조 내보내기
CREATE TABLE IF NOT EXISTS `push_request` (
  `id` varchar(50) NOT NULL COMMENT 'request code',
  `sender` varchar(50) DEFAULT NULL COMMENT 'sender',
  `receiver` varchar(50) DEFAULT NULL COMMENT 'recipient',
  `regid` text COMMENT 'recipient',
  `type` varchar(16) DEFAULT NULL COMMENT 'type (text, ...)',
  `command` varchar(16) DEFAULT NULL COMMENT 'command (chat, ...)',
  `namespace` text COMMENT 'namespace',
  `data` text COMMENT 'contents',
  `details` text COMMENT 'details',
  `status` varchar(16) DEFAULT NULL COMMENT 'status (init, success, fail)',
  `sent_date` datetime DEFAULT NULL COMMENT '전송일시',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `sender` (`sender`),
  KEY `receiver` (`receiver`),
  KEY `create_date` (`create_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 테이블 데이터 ubiaccess.push_request:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `push_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `push_request` ENABLE KEYS */;

-- 테이블 ubiaccess.server 구조 내보내기
CREATE TABLE IF NOT EXISTS `server` (
  `id` varchar(16) NOT NULL COMMENT '서버 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '서버 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '서버 설명',
  `use_yn` varchar(1) DEFAULT 'Y' COMMENT '사용 여부 (Y, N)',
  `port` varchar(5) DEFAULT NULL COMMENT '서비스 포트',
  `ssl_yn` varchar(1) DEFAULT NULL COMMENT 'SSL 적용여부 (Y, N)',
  `process_yn` varchar(1) DEFAULT NULL COMMENT '프로세스로 실행여부 (Y, N)',
  `legacy_type` varchar(8) DEFAULT NULL COMMENT '레거시 타입 (EAI, DB)',
  `legacy_type2` varchar(8) DEFAULT NULL COMMENT '레거시 타입2 (C-HIS, Oracle)',
  `external_id` varchar(16) DEFAULT NULL COMMENT 'External ID',
  `database_id` varchar(16) DEFAULT NULL COMMENT 'Database ID',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='서버 설정';

-- 테이블 데이터 ubiaccess.server:~1 rows (대략적) 내보내기
/*!40000 ALTER TABLE `server` DISABLE KEYS */;
INSERT INTO `server` (`id`, `name`, `details`, `use_yn`, `port`, `ssl_yn`, `process_yn`, `legacy_type`, `legacy_type2`, `external_id`, `database_id`, `create_date`, `modify_date`, `create_id`, `modify_id`) VALUES
	('smc', 'smc 서버', 'SMC 서버', NULL, '10921', 'N', 'N', 'EAI', 'CEHR', 'external03', NULL, '2018-11-05 13:20:00', '2018-11-05 13:20:01', NULL, NULL);
/*!40000 ALTER TABLE `server` ENABLE KEYS */;

-- 테이블 ubiaccess.server_controller 구조 내보내기
CREATE TABLE IF NOT EXISTS `server_controller` (
  `id` varchar(16) NOT NULL COMMENT '콘트롤러 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '콘트롤러 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '콘트롤러 설명',
  `use_yn` varchar(1) DEFAULT 'Y' COMMENT '사용 여부 (Y, N)',
  `parent_id` varchar(16) DEFAULT NULL COMMENT '이 콘트롤러가 속한 서버 ID',
  `request_type` varchar(8) DEFAULT NULL COMMENT '요청 타입 (get, post, ...)',
  `path` text COMMENT '요청 패스 (ex. /memphis/inpatient_list)',
  `file` text COMMENT '파일 패스 (콘트롤러 모듈이 들어있는 파일 패스, ex. /chis/inpatient_list_service)',
  `method` varchar(64) DEFAULT NULL COMMENT '실행 함수명 (ex. inpatient_list)',
  `upload` varchar(16) DEFAULT NULL COMMENT '업로드되는 파일의 키 값 (ex. photo)',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='콘트롤러 설정';

-- 테이블 데이터 ubiaccess.server_controller:~6 rows (대략적) 내보내기
/*!40000 ALTER TABLE `server_controller` DISABLE KEYS */;
INSERT INTO `server_controller` (`id`, `name`, `details`, `use_yn`, `parent_id`, `request_type`, `path`, `file`, `method`, `upload`, `create_date`, `modify_date`, `create_id`, `modify_id`) VALUES
	('1', 'hello', 'hello test', 'Y', 'smc', 'get', '/examples/hello', 'hello', 'hello', NULL, '2018-11-05 17:47:33', '2018-11-05 17:47:33', NULL, NULL),
	('2', 'params', 'params test', 'Y', 'smc', 'get', '/examples/params', 'params', 'params', NULL, '2018-11-05 17:48:56', '2018-11-05 17:48:56', NULL, NULL),
	('3', 'json', 'json test', 'Y', 'smc', 'post', '/examples/json', 'json', 'json', NULL, '2018-11-05 17:51:20', '2018-11-05 17:51:20', NULL, NULL),
	('4', 'readCountry', 'world test', 'Y', 'smc', 'post', '/examples/readCountry', 'world', 'readCountry', NULL, '2018-11-05 17:52:16', '2018-11-05 17:52:16', NULL, NULL),
	('5', 'readCountry2', 'world test', 'Y', 'smc', 'post', '/examples/readCountry2', 'world', 'readCountry2', NULL, '2018-11-05 17:52:51', '2018-11-05 17:52:51', NULL, NULL),
	('6', 'readCountry3', 'world test', 'Y', 'smc', 'post', '/examples/readCountry3', 'world', 'readCountry3', NULL, '2018-11-05 17:52:51', '2018-11-05 17:52:51', NULL, NULL);
/*!40000 ALTER TABLE `server_controller` ENABLE KEYS */;

-- 테이블 ubiaccess.server_controller_param 구조 내보내기
CREATE TABLE IF NOT EXISTS `server_controller_param` (
  `id` varchar(16) NOT NULL COMMENT '파라미터 ID',
  `name` varchar(64) DEFAULT NULL COMMENT '파라미터 이름',
  `details` varchar(64) DEFAULT NULL COMMENT '파라미터 설명',
  `parent_id` varchar(16) DEFAULT NULL COMMENT '이 파라미터가 속한 콘트롤러 ID',
  `param_type` varchar(8) DEFAULT NULL COMMENT '파라미터 타입 (single, tuple)',
  `param_name` varchar(64) DEFAULT NULL COMMENT '파라미터 이름 (single일 경우에는 값만 있음)',
  `param_value` varchar(64) DEFAULT NULL COMMENT '파라미터 값 (single일 경우에는 값만 있음)',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  `create_id` varchar(8) DEFAULT NULL COMMENT '생성자 ID',
  `modify_id` varchar(8) DEFAULT NULL COMMENT '수정자 ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='서버 콘트롤러를 위한 파라미터';

-- 테이블 데이터 ubiaccess.server_controller_param:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `server_controller_param` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_controller_param` ENABLE KEYS */;

-- 테이블 ubiaccess.stat_route 구조 내보내기
CREATE TABLE IF NOT EXISTS `stat_route` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `userid` text COMMENT '사용자ID',
  `direction` varchar(8) DEFAULT NULL COMMENT '방향 (request, response, error)',
  `path` text COMMENT '요청패스',
  `method` text COMMENT '요청메소드 (GET, POST, ...)',
  `func` text COMMENT '실행메소드',
  `params` longtext COMMENT '요청파라미터',
  `event_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '이벤트일시',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COMMENT='라우팅 함수 접근 로그';

-- 테이블 데이터 ubiaccess.stat_route:~52 rows (대략적) 내보내기
/*!40000 ALTER TABLE `stat_route` DISABLE KEYS */;
INSERT INTO `stat_route` (`id`, `userid`, `direction`, `path`, `method`, `func`, `params`, `event_date`, `create_date`, `modify_date`) VALUES
	(1, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:38:43', '2019-12-20 16:38:43', '2019-12-20 16:38:43'),
	(2, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:38:44', '2019-12-20 16:38:44', '2019-12-20 16:38:44'),
	(3, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:39:15', '2019-12-20 16:39:15', '2019-12-20 16:39:15'),
	(4, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:39:15', '2019-12-20 16:39:15', '2019-12-20 16:39:15'),
	(5, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:40:08', '2019-12-20 16:40:08', '2019-12-20 16:40:08'),
	(6, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:40:08', '2019-12-20 16:40:08', '2019-12-20 16:40:08'),
	(7, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:41:59', '2019-12-20 16:41:59', '2019-12-20 16:41:59'),
	(8, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:41:59', '2019-12-20 16:41:59', '2019-12-20 16:41:59'),
	(9, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:49:53', '2019-12-20 16:49:53', '2019-12-20 16:49:53'),
	(10, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:49:53', '2019-12-20 16:49:53', '2019-12-20 16:49:53'),
	(11, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:50:22', '2019-12-20 16:50:22', '2019-12-20 16:50:22'),
	(12, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:50:23', '2019-12-20 16:50:23', '2019-12-20 16:50:23'),
	(13, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:50:45', '2019-12-20 16:50:45', '2019-12-20 16:50:45'),
	(14, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:50:46', '2019-12-20 16:50:46', '2019-12-20 16:50:46'),
	(15, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:50:59', '2019-12-20 16:50:59', '2019-12-20 16:50:59'),
	(16, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:50:59', '2019-12-20 16:50:59', '2019-12-20 16:50:59'),
	(17, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:51:34', '2019-12-20 16:51:34', '2019-12-20 16:51:34'),
	(18, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:51:34', '2019-12-20 16:51:34', '2019-12-20 16:51:34'),
	(19, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:51:54', '2019-12-20 16:51:54', '2019-12-20 16:51:54'),
	(20, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:51:55', '2019-12-20 16:51:55', '2019-12-20 16:51:55'),
	(21, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:54:44', '2019-12-20 16:54:44', '2019-12-20 16:54:44'),
	(22, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:54:44', '2019-12-20 16:54:44', '2019-12-20 16:54:44'),
	(23, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:55:02', '2019-12-20 16:55:02', '2019-12-20 16:55:02'),
	(24, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:55:02', '2019-12-20 16:55:02', '2019-12-20 16:55:02'),
	(25, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:59:30', '2019-12-20 16:59:30', '2019-12-20 16:59:30'),
	(26, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:59:30', '2019-12-20 16:59:30', '2019-12-20 16:59:30'),
	(27, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 16:59:51', '2019-12-20 16:59:51', '2019-12-20 16:59:51'),
	(28, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 16:59:51', '2019-12-20 16:59:51', '2019-12-20 16:59:51'),
	(29, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 17:00:54', '2019-12-20 17:00:54', '2019-12-20 17:00:54'),
	(30, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 17:00:54', '2019-12-20 17:00:54', '2019-12-20 17:00:54'),
	(31, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 21:23:02', '2019-12-20 21:23:02', '2019-12-20 21:23:02'),
	(32, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 21:23:03', '2019-12-20 21:23:03', '2019-12-20 21:23:03'),
	(33, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 21:36:00', '2019-12-20 21:36:00', '2019-12-20 21:36:00'),
	(34, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 21:36:00', '2019-12-20 21:36:00', '2019-12-20 21:36:00'),
	(35, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-20 21:38:24', '2019-12-20 21:38:24', '2019-12-20 21:38:24'),
	(36, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-20 21:38:24', '2019-12-20 21:38:24', '2019-12-20 21:38:24'),
	(37, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 07:46:44', '2019-12-21 07:46:44', '2019-12-21 07:46:44'),
	(38, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 07:46:44', '2019-12-21 07:46:44', '2019-12-21 07:46:44'),
	(39, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 08:08:27', '2019-12-21 08:08:27', '2019-12-21 08:08:27'),
	(40, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 08:08:27', '2019-12-21 08:08:27', '2019-12-21 08:08:27'),
	(41, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 08:18:07', '2019-12-21 08:18:07', '2019-12-21 08:18:07'),
	(42, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 08:18:08', '2019-12-21 08:18:08', '2019-12-21 08:18:08'),
	(43, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 08:56:01', '2019-12-21 08:56:01', '2019-12-21 08:56:01'),
	(44, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 08:56:01', '2019-12-21 08:56:01', '2019-12-21 08:56:01'),
	(45, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 09:00:41', '2019-12-21 09:00:41', '2019-12-21 09:00:41'),
	(46, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 09:00:41', '2019-12-21 09:00:41', '2019-12-21 09:00:41'),
	(47, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 09:01:30', '2019-12-21 09:01:30', '2019-12-21 09:01:30'),
	(48, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 09:01:31', '2019-12-21 09:01:31', '2019-12-21 09:01:31'),
	(49, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 09:02:13', '2019-12-21 09:02:13', '2019-12-21 09:02:13'),
	(50, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 09:02:14', '2019-12-21 09:02:14', '2019-12-21 09:02:14'),
	(51, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 09:05:44', '2019-12-21 09:05:44', '2019-12-21 09:05:44'),
	(52, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 09:05:44', '2019-12-21 09:05:44', '2019-12-21 09:05:44'),
	(53, NULL, 'request', '/sboard/upload_capture_file', 'POST', NULL, NULL, '2019-12-21 09:07:25', '2019-12-21 09:07:25', '2019-12-21 09:07:25'),
	(54, NULL, 'response', '/sboard/upload_capture_file', 'POST', NULL, '{"requestCode":"101","code":200,"message":"sbt_smc_der_0001","resultType":"string","result":"success in uploading capture file."}', '2019-12-21 09:07:25', '2019-12-21 09:07:25', '2019-12-21 09:07:25');
/*!40000 ALTER TABLE `stat_route` ENABLE KEYS */;

-- 테이블 ubiaccess.stat_rpc 구조 내보내기
CREATE TABLE IF NOT EXISTS `stat_rpc` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `user_id` varchar(16) DEFAULT NULL COMMENT '사용자 ID',
  `method` varchar(32) DEFAULT NULL COMMENT '요청 메소드',
  `request_id` varchar(32) DEFAULT NULL COMMENT '요청 ID',
  `params` text COMMENT '요청 파라미터',
  `event_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '이벤트 발생일시',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='JSON-RPC 핸들러 접근 로그';

-- 테이블 데이터 ubiaccess.stat_rpc:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `stat_rpc` DISABLE KEYS */;
/*!40000 ALTER TABLE `stat_rpc` ENABLE KEYS */;

-- 테이블 ubiaccess.stat_socketio 구조 내보내기
CREATE TABLE IF NOT EXISTS `stat_socketio` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `socket_id` varchar(64) DEFAULT NULL COMMENT '소켓 ID',
  `userid` text COMMENT '사용자 ID',
  `direction` varchar(8) DEFAULT NULL COMMENT '방향 (request, response, error)',
  `event_name` varchar(32) DEFAULT NULL COMMENT '이벤트 이름',
  `method_name` varchar(32) DEFAULT NULL COMMENT '설정된 함수이름',
  `file_name` text COMMENT '설정된 파일이름',
  `params` text COMMENT '파라미터',
  `event_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '이벤트 발생일시',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='socket.io 핸들러 접근 로그';

-- 테이블 데이터 ubiaccess.stat_socketio:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `stat_socketio` DISABLE KEYS */;
/*!40000 ALTER TABLE `stat_socketio` ENABLE KEYS */;

-- 테이블 ubiaccess.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동생성 ID',
  `id` varchar(16) DEFAULT NULL COMMENT '사용자 ID',
  `name` varchar(32) DEFAULT NULL COMMENT '사용자 이름',
  `emp_type` varchar(8) DEFAULT NULL COMMENT '직종',
  `emp_charge` varchar(8) DEFAULT NULL COMMENT '직책',
  `emp_level` varchar(8) DEFAULT NULL COMMENT '직급',
  `dept_id` varchar(16) DEFAULT NULL COMMENT '소속과 ID',
  `dept_name` varchar(32) DEFAULT NULL COMMENT '소속과 이름',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `modify_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='사용자';

-- 테이블 데이터 ubiaccess.users:~3 rows (대략적) 내보내기
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`_id`, `id`, `name`, `emp_type`, `emp_charge`, `emp_level`, `dept_id`, `dept_name`, `create_date`, `modify_date`) VALUES
	(1, '102010', '김준수', 'MD', '과장', '교수', 'D_001_001', '경영지원실', '2017-05-26 09:09:14', '2017-05-26 09:09:15'),
	(2, '101010', '이영희', 'MD', '사원', '사원', 'D_001_001', '경영지원실', '2017-05-27 11:37:37', '2017-05-27 11:37:39'),
	(3, '103010', '박현철', 'MD', '', '사원', 'D_001_001', '경영지원실', '2017-05-27 11:38:38', '2017-05-27 11:38:39'),
	(4, '801010', '김희연', 'NR', NULL, '사원', 'D_001_001', '경영지원실', '2017-05-27 11:39:49', '2017-05-27 11:39:51');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
