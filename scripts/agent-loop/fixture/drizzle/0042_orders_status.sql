DROP INDEX IF EXISTS orders_status_idx;
CREATE INDEX orders_status_created_idx ON orders (status, created_at DESC);
