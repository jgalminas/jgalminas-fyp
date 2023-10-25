
-- GRANTING PERMISSIONS TO DB USER

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO <db_user>; 

-- FUNCTIONS

CREATE OR REPLACE FUNCTION verify_tenant(col VARCHAR) RETURNS BOOLEAN AS $$
BEGIN
    IF current_user = 'admin' THEN
        RETURN TRUE;
    ELSIF current_setting('db.user_id', true) IS NULL THEN
        RETURN FALSE;
    ELSE
        RETURN col = current_setting('db.tenant_id')::VARCHAR;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION verify_user(col VARCHAR) RETURNS BOOLEAN AS $$
BEGIN
    IF current_user = 'admin' THEN
        RETURN TRUE;
    ELSIF current_setting('db.user_id', true) IS NULL THEN
        RETURN FALSE;
    ELSE
        RETURN col = current_setting('db.user_id')::VARCHAR;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION verify_vault_access(col VARCHAR) RETURNS BOOLEAN AS $$
BEGIN
    IF current_user = 'admin' THEN
        RETURN TRUE;
    ELSIF current_setting('db.user_id', true) IS NULL THEN
        RETURN FALSE;
    ELSE
        RETURN EXISTS (
            SELECT 1
            FROM team_member
            WHERE team_member.user_id = current_setting('db.user_id')::VARCHAR
            AND team_member.vault_id = col
        );
    END IF;
END;
$$ LANGUAGE plpgsql;


-- VAULT

ALTER TABLE "vault" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vault_select_policy" ON "vault";
CREATE POLICY "vault_select_policy"
ON "vault"
FOR SELECT
USING (verify_vault_access(id));

DROP POLICY IF EXISTS "vault_insert_policy" ON "vault";
CREATE POLICY "vault_insert_policy"
ON "vault"
FOR INSERT
WITH CHECK (verify_vault_access(id));

DROP POLICY IF EXISTS "vault_update_policy" ON "vault";
CREATE POLICY "vault_update_policy"
ON "vault"
FOR UPDATE
USING (verify_vault_access(id));

DROP POLICY IF EXISTS "vault_delete_policy" ON "vault";
CREATE POLICY "vault_delete_policy"
ON "vault"
FOR DELETE
USING (verify_vault_access(id));

-- USER

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_select_policy" ON "user";
CREATE POLICY "user_select_policy"
ON "user"
FOR SELECT
USING (verify_user(id));

DROP POLICY IF EXISTS "user_delete_policy" ON "user";
CREATE POLICY "user_delete_policy"
ON "user"
FOR DELETE
USING (verify_user(id));

DROP POLICY IF EXISTS "user_insert_policy" ON "user";
CREATE POLICY "user_insert_policy"
ON "user"
FOR INSERT
WITH CHECK(true);

DROP POLICY IF EXISTS "user_update_policy" ON "user";
CREATE POLICY "user_update_policy"
ON "user"
FOR UPDATE
USING (verify_user(id));