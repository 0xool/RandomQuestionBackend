import * as dotenv from 'dotenv'
import fs from 'fs';

dotenv.config()
const env = process.env;

export default function database() {
    return {
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME || 'Therapist_DB',
        // port: env.DB_PORT || 3306,
        ssl: false
    }
}
