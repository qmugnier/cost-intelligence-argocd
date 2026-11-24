-- With Kubecost, which reports a controller's name without its kind, the daily history of an
-- application matched none of its controllers, stored no day and still marked its days recorded. An
-- application with progress but no day is recorded again from scratch; one that really cost nothing
-- is measured once more and ends up the same.
DELETE FROM cost_daily_progress p
WHERE NOT EXISTS (
    SELECT 1 FROM cost_daily d
    WHERE d.application_namespace = p.application_namespace
      AND d.application_name = p.application_name
);
