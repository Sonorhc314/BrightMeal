-- Iteration from charity interview feedback (CW2)
-- Charities requested: food hygiene rating visible, photo support, best-before dates

-- Add food hygiene rating to profiles (FSA rating 1-5, for donors)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS food_hygiene_rating INTEGER CHECK (food_hygiene_rating IS NULL OR (food_hygiene_rating >= 1 AND food_hygiene_rating <= 5));

-- Add photo URL and date type to donations
ALTER TABLE donations ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS date_type TEXT DEFAULT 'use_by' CHECK (date_type IN ('use_by', 'best_before'));
