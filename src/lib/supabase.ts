import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://ruvorjvfbqtmcrvplkzs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1dm9yanZmYnF0bWNydnBsa3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NzA4NzksImV4cCI6MjA1MDI0Njg3OX0.j1x-HmrGpUVLT3AqWoZB7y_ubl5g8m8OnVO4GIdhREs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 