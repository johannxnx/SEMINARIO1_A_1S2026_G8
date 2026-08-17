-- ============================================================
--  TaskFlow + CloudDrive — Esquema PostgreSQL
--  Seminario de Sistemas 1 — USAC 2026
-- ============================================================

-- Extensión para UUIDs (opcional pero recomendado)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLA: users
-- ============================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,          -- bcrypt hash
    profile_pic   TEXT,                           -- URL del objeto en S3/Blob
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: tasks
-- ============================================================
CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    completed   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: files
-- ============================================================
CREATE TABLE files (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename    VARCHAR(255) NOT NULL,
    file_type   VARCHAR(50)  NOT NULL,   -- 'image' | 'text' | etc.
    file_url    TEXT         NOT NULL,   -- URL pública en S3 / Blob Storage
    file_size   BIGINT,                  -- tamaño en bytes
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email    ON users(email);

-- ============================================================
-- FUNCIÓN: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
