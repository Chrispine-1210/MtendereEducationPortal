import postgres from 'postgres';

const sql = postgres(process.env.DATABASEURL,
    {ssl: 'verify-full'});