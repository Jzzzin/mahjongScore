
USE `jzzzin`;

START TRANSACTION;


### game

alter table game add comment TEXT after uma_point;


COMMIT;
