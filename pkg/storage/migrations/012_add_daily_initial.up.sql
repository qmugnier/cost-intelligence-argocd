-- A day's cost is recorded when the day ends and, with Kubecost, fetched again for the next days as
-- Kubecost reconciles it with the cloud bill (up to 72 hours later). The initial_* columns keep what
-- was recorded first, never replaced, so the gap between the two says how much the reconciliation
-- usually moves each resource. Rows from before this migration were recorded once, so their initial
-- values are the values they hold.
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS initial_total_cost   DOUBLE PRECISION;
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS initial_cpu_cost     DOUBLE PRECISION;
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS initial_memory_cost  DOUBLE PRECISION;
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS initial_network_cost DOUBLE PRECISION;
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS initial_storage_cost DOUBLE PRECISION;
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS initial_recorded_at  TIMESTAMPTZ;

UPDATE cost_daily
SET initial_total_cost = total_cost,
    initial_cpu_cost = cpu_cost,
    initial_memory_cost = memory_cost,
    initial_network_cost = network_cost,
    initial_storage_cost = storage_cost,
    initial_recorded_at = recorded_at
WHERE initial_total_cost IS NULL;
