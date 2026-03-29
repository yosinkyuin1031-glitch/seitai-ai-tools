-- 整体院AIツール: 生成コンテンツ保存テーブル
CREATE TABLE IF NOT EXISTS ai_tool_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('blog', 'quiz', 'diagnosis')),
  title TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}',
  output_data JSONB NOT NULL DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_tool_contents_user ON ai_tool_contents(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_contents_type ON ai_tool_contents(user_id, tool_type);

ALTER TABLE ai_tool_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contents" ON ai_tool_contents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contents" ON ai_tool_contents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contents" ON ai_tool_contents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contents" ON ai_tool_contents
  FOR DELETE USING (auth.uid() = user_id);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_ai_tool_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ai_tool_contents_updated ON ai_tool_contents;
CREATE TRIGGER trigger_ai_tool_contents_updated
  BEFORE UPDATE ON ai_tool_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_tool_contents_updated_at();
