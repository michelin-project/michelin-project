// URL de base de l'API backend, injectée par Vite depuis la variable
// d'environnement `VITE_API_URL` (voir front/.env).
// Fallback local conservé pour le dev sans fichier .env.
export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
