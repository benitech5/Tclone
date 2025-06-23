-- Add tsvector column
ALTER TABLE messages ADD COLUMN content_tsv tsvector;

-- Create function to update tsvector
CREATE OR REPLACE FUNCTION messages_trigger() RETURNS trigger AS $$
begin
  new.content_tsv := to_tsvector('english', coalesce(new.content,''));
  return new;
end
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update tsvector column
CREATE TRIGGER messages_update_trigger
    BEFORE INSERT OR UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION messages_trigger();

-- Create index for full-text search
CREATE INDEX messages_content_tsv_idx ON messages USING GIN (content_tsv);

-- Update existing messages
UPDATE messages SET content_tsv = to_tsvector('english', content); 