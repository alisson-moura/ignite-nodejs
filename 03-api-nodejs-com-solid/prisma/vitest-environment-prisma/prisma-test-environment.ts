import 'dotenv';
import { execSync } from 'node:child_process';
import { randomUUID } from 'crypto';
import { type Environment } from 'vitest';
import { PrismaClient } from '@prisma/client';

function generateDatabaseURL (schema: string): string {
  if (process.env.DATABASE_URL == null) {
    throw new Error('Please provide a DATABASE_URL enviroment variable.');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);
  return url.toString();
}

const prisma = new PrismaClient();

const environment: Environment = {
  name: 'prisma',
  async setup () {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);
    process.env.DATABASE_URL = databaseURL;
    execSync('npx prisma migrate deploy');

    return {
      async teardown () {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
        await prisma.$disconnect();
      }
    };
  },
  transformMode: 'ssr'
};

export default environment;
