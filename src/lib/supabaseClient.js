import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] Defina REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY num ficheiro .env na raiz do projeto (copie .env.example). Reinicie npm start após guardar.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
