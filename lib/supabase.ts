
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnfhqdovshjnflfycfti.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZmhxZG92c2hqbmZsZnljZnRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk4MDY2MiwiZXhwIjoyMDg2NTU2NjYyfQ.ZfeMqi4bcD8OGFbuiBZVGAbkGbVy2GiqXjJRx2tAYKc';

export const supabase = createClient(supabaseUrl, supabaseKey);
