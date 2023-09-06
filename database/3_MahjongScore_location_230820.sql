
USE `jzzzin`;

START TRANSACTION;


CREATE TABLE IF NOT EXISTS location
(
    location_no INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(50) NOT NULL,
    use_yn TINYINT(1) NOT NULL DEFAULT 1,
    created_date  DATETIME,
    created_by    TEXT       NULL,
    modified_date DATETIME,
    CONSTRAINT uk_location_location_name
    UNIQUE (location_name)
);

INSERT INTO location (location_no, location_name, use_yn, created_by) VALUES (	1, '성산마장', 1, 'init');
INSERT INTO location (location_no, location_name, use_yn, created_by) VALUES (	2, '서울대입구 마작카페', 1, 'init');
INSERT INTO location (location_no, location_name, use_yn, created_by) VALUES (	3, '방배마장', 1, 'init');


### meet

UPDATE meet
SET location = '0'
WHERE location != '';

alter table meet modify meet_time varchar(6) not null;

UPDATE meet
SET meet_time = CONCAT(meet_time,'00')
WHERE LENGTH(meet_time) = 4;

alter table meet modify meet_day date not null;
alter table meet modify meet_time time not null;
alter table meet change location location_no int unsigned not null;
alter table meet add win_member_no INT UNSIGNED not null default 0 after location_no;

create index idx_meet_win_member_no
    on meet (win_member_no);

UPDATE meet
SET location_no = '1'
WHERE location_no = '';

UPDATE meet
SET location_no = '2'
WHERE meet_no = '2';


### game

alter table game add yakuman_member_no INT UNSIGNED not null default 0 after uma_point;

create index idx_game_meet_no
    on game (meet_no);
create index idx_game_yakuman_member_no
    on game (yakuman_member_no);


COMMIT;
