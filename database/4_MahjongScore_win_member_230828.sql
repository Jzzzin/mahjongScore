
USE `jzzzin`;

START TRANSACTION;


### meet

UPDATE meet meet
LEFT JOIN (
    SELECT tmp.meet_no,
           tmp.member_no
    FROM (
             SELECT meet.meet_no,
                    member.member_no,
                    SUM(map.point) AS totalPoint
             FROM game_member_map map
                      LEFT JOIN game game ON game.game_no = map.game_no
                      LEFT JOIN meet meet ON meet.meet_no = game.meet_no
                      LEFT JOIN member member ON member.member_no = map.member_no
             WHERE game.end_yn = '1'
               AND meet.end_yn = '1'
             GROUP BY meet.meet_no, map.member_no
             ORDER BY totalPoint DESC
         ) tmp
    GROUP BY meet_no
) winMember ON meet.meet_no = winMember.meet_no
SET meet.win_member_no = COALESCE(winMember.member_no, 0)
WHERE meet.end_yn = '1';


COMMIT;
