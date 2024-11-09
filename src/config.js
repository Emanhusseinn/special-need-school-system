import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://igyeidjyzcwwottiswcl.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneWVpZGp5emN3d290dGlzd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTkyNjQsImV4cCI6MjA0NjEzNTI2NH0.JMigAM4TbgqUVqVbtkR29P-BTEe5QjLMJAQ10nGqrMM"
export const supabase = createClient(supabaseUrl, supabaseKey)