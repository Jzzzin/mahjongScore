
USE `jzzzin`;

START TRANSACTION;


### meet

alter table meet add lose_member_no INT UNSIGNED not null default 0 after win_member_no;

create index idx_meet_lose_member_no
  on meet (lose_member_no);

# UPDATE meet meet
# LEFT JOIN (
#     SELECT tmp.meet_no,
#            tmp.member_no
#     FROM (
#              SELECT meet.meet_no,
#                     member.member_no,
#                     SUM(map.point) AS totalPoint
#              FROM game_member_map map
#                       LEFT JOIN game game ON game.game_no = map.game_no
#                       LEFT JOIN meet meet ON meet.meet_no = game.meet_no
#                       LEFT JOIN member member ON member.member_no = map.member_no
#              WHERE game.end_yn = '1'
#                AND meet.end_yn = '1'
#              GROUP BY meet.meet_no, map.member_no
#              ORDER BY totalPoint ASC
#          ) tmp
#     GROUP BY meet_no
# ) loseMember ON meet.meet_no = loseMember.meet_no
# SET meet.lose_member_no = COALESCE(loseMember.member_no, 0)
# WHERE meet.end_yn = '1';

UPDATE meet_member_map map
LEFT JOIN meet meet ON map.meet_no = meet.meet_no
LEFT JOIN ( SELECT tmp.rn,
                   IF(tmp.rn < 4, 4 - CAST(tmp.rn AS UNSIGNED), 0) AS 'point',
                   tmp.meet_no,
                   tmp.member_no
            FROM ( SELECT meet_no,
                          member_no,
                          totalPoint,
                          CASE WHEN @part = meet_no THEN @rn := @rn + 1
                               ELSE @rn := 1
                          END AS rn,
                          @part := meet_no AS PART
                     FROM ( SELECT meet.meet_no,
                                   member.member_no,
                                   SUM(map.point) AS totalPoint
                            FROM game_member_map map
                                LEFT JOIN game game ON game.game_no = map.game_no
                                LEFT JOIN meet meet ON meet.meet_no = game.meet_no
                                LEFT JOIN member member ON member.member_no = map.member_no
                            WHERE game.end_yn = '1'
                              AND meet.end_yn = '1'
                            GROUP BY meet.meet_no, map.member_no
                            ORDER BY meet.meet_no, totalPoint DESC
                          ) as tmp,
                          (SELECT @rn := 0, @part := null) AS x
                     ORDER BY meet_no ASC, totalPoint DESC
                 ) tmp
          ) meetRank ON map.meet_no = meetRank.meet_no AND map.member_no = meetRank.member_no
SET map.rank = COALESCE(meetRank.rn, 0),
    map.point = COALESCE(meetRank.point, 0)
WHERE meet.end_yn = '1'
  AND map.attend_yn = '1';

### meet_member_map

alter table meet_member_map add rank SMALLINT not null default 0 after member_no;
alter table meet_member_map add point SMALLINT not null default 0 after rank;

UPDATE meet_member_map map
LEFT JOIN meet meet ON map.meet_no = meet.meet_no
LEFT JOIN (
    SELECT tmp.rank,
           IF(tmp.rank < 4, 4 - CAST(tmp.rank AS UNSIGNED), 0) AS 'point',
           tmp.meet_no,
           tmp.member_no
    FROM (
             SELECT RANK() OVER w  AS 'rank',
                    meet.meet_no,
                    member.member_no,
                    SUM(map.point) AS totalPoint
             FROM game_member_map map
                      LEFT JOIN game game ON game.game_no = map.game_no
                      LEFT JOIN meet meet ON meet.meet_no = game.meet_no
                      LEFT JOIN member member ON member.member_no = map.member_no
             WHERE game.end_yn = '1'
               AND meet.end_yn = '1'
             GROUP BY meet.meet_no, map.member_no
                 WINDOW w AS (PARTITION BY meet.meet_no ORDER BY meet.meet_no, totalPoint DESC)
         ) tmp
) meetRank ON map.meet_no = meetRank.meet_no AND map.member_no = meetRank.member_no
SET map.rank = COALESCE(meetRank.rank, 0),
    map.point = COALESCE(meetRank.point, 0)
WHERE meet.end_yn = '1'
  AND map.attend_yn = '1';


COMMIT;
