import { query } from '../db/client';

export interface User {
  id: string;
  email: string;
  name: string | null;
  githubLogin: string | null;
  jiraAccountId: string | null;
  createdAt: string;
}

/**
 * Resolves an existing user by email or creates a new one.
 * If GitHub login or Jira Account ID are provided and the user currently lacks them,
 * the record is updated. This operation is idempotent.
 */
export async function resolveOrCreateUser(
  email: string,
  githubLogin?: string,
  jiraAccountId?: string
): Promise<User> {
  // Use upsert to cleanly handle concurrent inserts and partial updates.
  // COALESCE ensures we don't overwrite existing populated fields with nulls.
  const text = `
    INSERT INTO users (email, github_login, jira_account_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO UPDATE SET
      github_login = COALESCE(users.github_login, EXCLUDED.github_login),
      jira_account_id = COALESCE(users.jira_account_id, EXCLUDED.jira_account_id)
    RETURNING *;
  `;
  
  const values = [email, githubLogin || null, jiraAccountId || null];

  const res = await query(text, values);
  const row = res.rows[0];

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    githubLogin: row.github_login,
    jiraAccountId: row.jira_account_id,
    createdAt: row.created_at
  };
}
