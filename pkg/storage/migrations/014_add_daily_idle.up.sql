-- The share of the cluster's idle cost a day carries when idle is shared, beside its other costs.
ALTER TABLE cost_daily ADD COLUMN IF NOT EXISTS idle_cost DOUBLE PRECISION NOT NULL DEFAULT 0;
