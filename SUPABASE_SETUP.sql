-- ==========================================
-- CyberRing Supabase 数据库初始化脚本
-- ==========================================
-- 请在 Supabase Dashboard 的 SQL Editor 中运行以下代码

-- 1. 领域表 (Domains)
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 项目/闭环表 (Projects)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  scale FLOAT DEFAULT 1,
  color TEXT,
  domain_id TEXT REFERENCES domains(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 任务表 (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  estimated_time INT DEFAULT 0,
  actual_time INT DEFAULT 0,
  status TEXT DEFAULT 'TODO',
  "order" INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 日志表 (Logs)
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  target_name TEXT NOT NULL,
  xp_amount INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 安全配置 (RLS)
-- 为了方便快速开始，这里禁用了 RLS。
-- 在生产环境中，建议开启 RLS 并配置具体的 Policy。
ALTER TABLE domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE logs DISABLE ROW LEVEL SECURITY;
