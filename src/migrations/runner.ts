import { MigrationModel } from "./migration.model";

export async function runMigration(name: string, handler: () => Promise<void>) {
  const existed = await MigrationModel.findOne({ name });

  if (existed) {
    console.log(`⏩ Migration ${name} already executed`);
    return;
  }
  
  console.log(`🚀 Running migration: ${name}`);

  await handler();

  await MigrationModel.create({ name, executed_at: new Date() });

  console.log(`✅ Migration ${name} completed`);
}
