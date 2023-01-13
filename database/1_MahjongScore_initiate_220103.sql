--
-- Database 생성
--
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mahjong_score` /*!40100 DEFAULT CHARACTER SET utf8 */;

--
-- User 생성
--
CREATE USER /*!32312 IF NOT EXISTS*/ 'mahjong_score_user'@'%' IDENTIFIED BY 'mahjong_score_password';

--
-- 권한 부여
--
GRANT ALL PRIVILEGES ON mahjong_score.* TO 'mahjong_score_user'@'%';

--
-- Table 생성
--
USE `mahjong_score`;


START TRANSACTION;


CREATE TABLE IF NOT EXISTS member
(
    member_no     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_name   VARCHAR(50) NOT NULL,
    use_yn        TINYINT(1) NOT NULL DEFAULT 1,
    created_date  DATETIME,
    created_by    TEXT       NULL,
    modified_date DATETIME
);



CREATE TABLE IF NOT EXISTS meet
(
    meet_no INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    meet_day VARCHAR(8) NOT NULL,
    meet_time VARCHAR(4) NOT NULL,
    location TEXT NOT NULL,
    end_yn TINYINT(1) NOT NULL DEFAULT 0,
    created_date  DATETIME,
    created_by    TEXT       NULL,
    modified_date DATETIME,
    CONSTRAINT uk_meet_meet_day
        UNIQUE (meet_day)
);

CREATE TABLE IF NOT EXISTS meet_member_map
(
    seq INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    meet_no INT UNSIGNED NOT NULL,
    member_no INT UNSIGNED NOT NULL,
    attend_yn TINYINT(1) NOT NULL DEFAULT 0,
    created_date  DATETIME,
    created_by    TEXT       NULL,
    modified_date DATETIME,
   	CONSTRAINT uk_meet_member_meet_no_member_no
		UNIQUE (meet_no, member_no)
);

CREATE TABLE IF NOT EXISTS game
(
    game_no INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    meet_no INT UNSIGNED NOT NULL,
    game_number VARCHAR(10) NOT NULL,
    game_member_count TINYINT(1) NOT NULL DEFAULT 4,
    game_type VARCHAR(5) NOT NULL DEFAULT 'HALF',
    start_score INT NOT NULL DEFAULT 25000,
    return_score INT NOT NULL DEFAULT 30000,
    oka_point SMALLINT NOT NULL DEFAULT 20,
    uma_point SMALLINT NOT NULL DEFAULT 10,
    end_yn TINYINT(1) NOT NULL DEFAULT 0,
    created_date  DATETIME,
    created_by    TEXT       NULL,
    modified_date DATETIME
);

CREATE TABLE IF NOT EXISTS game_member_map
(
    seq INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    game_no INT UNSIGNED NOT NULL,
    member_no INT UNSIGNED NOT NULL,
    position VARCHAR(5) NOT NULL DEFAULT '',
    score INT NOT NULL DEFAULT 0,
    rank SMALLINT NOT NULL DEFAULT 0,
    point DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    created_date  DATETIME,
    created_by    TEXT       NULL,
    modified_date DATETIME,
    CONSTRAINT uk_game_member_game_no_member_no
    UNIQUE (game_no, member_no)
);

--
-- initial data
--
INSERT INTO member (member_no, member_name, use_yn, created_by) VALUES (	1, '양두열', 1, 'init');
INSERT INTO member (member_no, member_name, use_yn, created_by) VALUES (	2, '홍정표', 1, 'init');
INSERT INTO member (member_no, member_name, use_yn, created_by) VALUES (	3, '정현진', 1, 'init');
INSERT INTO member (member_no, member_name, use_yn, created_by) VALUES (	4, '고은영', 1, 'init');


COMMIT;
