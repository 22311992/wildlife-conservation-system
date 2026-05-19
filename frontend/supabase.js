const supabaseUrl = 'https://izttjdcxsdmktxdnhlln.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dHRqZGN4c2Rta3R4ZG5obGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MzA1MTYsImV4cCI6MjA5NDUwNjUxNn0.bdUbfWpN9L4vtBEsatt1TgiejlubxVk0YSIfx5G5s2Q';

const supabaseClient = supabase.createClient(
   supabaseUrl,
   supabaseKey
);