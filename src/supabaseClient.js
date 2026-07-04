import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bpixyjwgqkdmmkjdeany.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaXh5andncWtkbW1ramRlYW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjU5MjIsImV4cCI6MjA3MzcwMTkyMn0.5ayUxhfFIzJVVnvhayp-SHT73TctAYo9nB6ZhB_acCk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);