---
name: Supabase Database Operations
description: Manage Supabase database schema, migrations, and RLS policies for VibeCheck
---

# Supabase Database Operations

This skill provides guidance for working with Supabase as the database backend for VibeCheck.

## Prerequisites

- Supabase MCP server is configured and available
- Project ID is known (use `list_projects` to find it)

## Core Tables

The VibeCheck database consists of these primary tables:

| Table | Purpose |
|-------|---------|
| `user_profiles` | Extended user data, subscription tier, scan limits |
| `scans` | Scan job queue and status |
| `scan_results` | Detailed findings from each scanner |
| `competitors` | Tracked competitor URLs |

## Common Operations

### List All Tables

```tool
mcp_supabase-mcp-server_list_tables
project_id: <project_id>
schemas: ["public"]
```

### Execute SQL Queries

```tool
mcp_supabase-mcp-server_execute_sql
project_id: <project_id>
query: <sql_query>
```

### Apply Schema Migrations

When modifying the database schema, always use migrations:

```tool
mcp_supabase-mcp-server_apply_migration
project_id: <project_id>
name: <snake_case_migration_name>
query: <ddl_sql>
```

### Generate TypeScript Types

After schema changes, regenerate types for type-safe queries:

```tool
mcp_supabase-mcp-server_generate_typescript_types
project_id: <project_id>
```

## Schema Guidelines

### User Profiles

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
    scans_used INTEGER DEFAULT 0,
    scans_limit INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Scans Table

```sql
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    target_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    scan_types TEXT[], -- ['security', 'seo', 'legal', 'api_keys', 'ai_detection', 'competitor']
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

### Scan Results

```sql
CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    scanner_type TEXT NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    findings JSONB,
    recommendations JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS)

Always enable RLS and create appropriate policies:

```sql
-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Users can only see their own scans
CREATE POLICY "Users can view own scans"
ON scans FOR SELECT
USING (auth.uid() = user_id);

-- Users can create scans for themselves
CREATE POLICY "Users can create own scans"
ON scans FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Checking Security Advisors

After making DDL changes, always run security advisors:

```tool
mcp_supabase-mcp-server_get_advisors
project_id: <project_id>
type: security
```

## Troubleshooting

### Check Recent Logs

```tool
mcp_supabase-mcp-server_get_logs
project_id: <project_id>
service: postgres
```

### List Migrations

```tool
mcp_supabase-mcp-server_list_migrations
project_id: <project_id>
```
