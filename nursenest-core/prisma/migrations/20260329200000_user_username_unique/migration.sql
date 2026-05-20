-- Optional login handle; UNIQUE allows multiple NULL rows in PostgreSQL.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "username" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User" ("username");
