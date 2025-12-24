-- Create function to increment product click count
CREATE OR REPLACE FUNCTION increment_click_count(product_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products 
  SET 
    click_count = click_count + 1,
    updated_at = NOW()
  WHERE id = product_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_click_count(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_click_count(INTEGER) TO anon;