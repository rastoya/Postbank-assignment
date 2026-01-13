USE timetracker;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_init_and_seed $$

CREATE PROCEDURE sp_init_and_seed()
BEGIN
  DECLARE u INT DEFAULT 1;
  DECLARE max_user_id INT;
  DECLARE logs_count INT;
  DECLARE j INT;

  DECLARE d DATE;
  DECLARE pid INT;

  DECLARE current_total DECIMAL(6,2);
  DECLARE remaining DECIMAL(6,2);
  DECLARE h DECIMAL(6,2);

  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE `TimeLog`;
  TRUNCATE TABLE `User`;
  TRUNCATE TABLE `Project`;
  TRUNCATE TABLE `CollectedBatch`;
  SET FOREIGN_KEY_CHECKS = 1;

  INSERT INTO `Project`(Name) VALUES ('My own'), ('Free Time'), ('Work');

  INSERT INTO `User`(FirstName, MiddleName, LastName, Email)
  SELECT
    fn,
    ELT(FLOOR(1 + RAND()*11),
      'John','Gringo','Mark','Lisa','Maria','Sonya','Philip','Jose','Lorenzo','George','Justin') AS MiddleName,
    ln,
    LOWER(CONCAT(fn, '.', ln, '@',
      ELT(FLOOR(1 + RAND()*3), 'hotmail.com','gmail.com','live.com')
    )) AS Email
  FROM (
    SELECT fn, ln
    FROM (
      SELECT 'John' AS fn UNION ALL SELECT 'Gringo' UNION ALL SELECT 'Mark' UNION ALL
      SELECT 'Lisa' UNION ALL SELECT 'Maria' UNION ALL SELECT 'Sonya' UNION ALL
      SELECT 'Philip' UNION ALL SELECT 'Jose' UNION ALL SELECT 'Lorenzo' UNION ALL
      SELECT 'George' UNION ALL SELECT 'Justin'
    ) AS fn_list
    CROSS JOIN (
      SELECT 'Johnson' AS ln UNION ALL SELECT 'Lamas' UNION ALL SELECT 'Jackson' UNION ALL
      SELECT 'Brown' UNION ALL SELECT 'Mason' UNION ALL SELECT 'Rodriguez' UNION ALL
      SELECT 'Roberts' UNION ALL SELECT 'Thomas' UNION ALL SELECT 'Rose' UNION ALL
      SELECT 'McDonalds'
    ) AS ln_list
    ORDER BY RAND()
    LIMIT 100
  ) AS name_pairs;

  SELECT MAX(Id) INTO max_user_id FROM `User`;

  SET u = 1;

  user_loop: WHILE u <= max_user_id DO

    IF (SELECT COUNT(*) FROM `User` WHERE Id = u) = 0 THEN
      SET u = u + 1;
      ITERATE user_loop;
    END IF;

    DROP TEMPORARY TABLE IF EXISTS tmp_daily;
    CREATE TEMPORARY TABLE tmp_daily (
      WorkDate DATE PRIMARY KEY,
      TotalHours DECIMAL(6,2) NOT NULL
    );

    SET logs_count = FLOOR(1 + RAND()*20);
    SET j = 1;

    log_loop: WHILE j <= logs_count DO

      SET d = DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND()*30) DAY);

      SET pid = (SELECT Id FROM `Project` ORDER BY RAND() LIMIT 1);

      SET current_total = COALESCE((SELECT TotalHours FROM tmp_daily WHERE WorkDate = d), 0.00);
      SET remaining = 8.00 - current_total;

      IF remaining < 0.25 THEN
        ITERATE log_loop;
      END IF;

      SET h = (RAND() * (8.00 - 0.25)) + 0.25;
      SET h = LEAST(h, remaining);

      SET h = ROUND(h * 4) / 4;

      IF h < 0.25 THEN
        ITERATE log_loop;
      END IF;

      INSERT INTO `TimeLog`(UserId, ProjectId, WorkDate, Hours)
      VALUES (u, pid, d, h);

      INSERT INTO tmp_daily(WorkDate, TotalHours)
      VALUES (d, h)
      ON DUPLICATE KEY UPDATE TotalHours = TotalHours + VALUES(TotalHours);

      SET j = j + 1;
    END WHILE log_loop;

    SET u = u + 1;
  END WHILE user_loop;

END $$

DELIMITER ;

CALL sp_init_and_seed();
