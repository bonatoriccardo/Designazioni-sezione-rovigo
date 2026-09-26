import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL);
export const CATEGORIE = ['U14', 'U16', 'U18', 'SERIE C'];
