ALTER TABLE cost_daily DROP COLUMN IF EXISTS initial_recorded_at;
ALTER TABLE cost_daily DROP COLUMN IF EXISTS initial_storage_cost;
ALTER TABLE cost_daily DROP COLUMN IF EXISTS initial_network_cost;
ALTER TABLE cost_daily DROP COLUMN IF EXISTS initial_memory_cost;
ALTER TABLE cost_daily DROP COLUMN IF EXISTS initial_cpu_cost;
ALTER TABLE cost_daily DROP COLUMN IF EXISTS initial_total_cost;
