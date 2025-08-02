-- Function to get email by username for login purposes
-- This should be created in your Supabase SQL editor

CREATE OR REPLACE FUNCTION get_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    -- Get the user_id from profiles table
    SELECT auth.users.email INTO user_email
    FROM profiles
    JOIN auth.users ON profiles.user_id = auth.users.id
    WHERE profiles.username = lower(username_input);
    
    RETURN user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_email_by_username(text) TO authenticated;
