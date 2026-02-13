import mongoose, { Schema, Document } from "mongoose";

export interface IMigration extends Document {
  name: string;
  executed_at: Date;
}

const MigrationSchema = new Schema<IMigration>({
  name: { type: String, required: true, unique: true },
  executed_at: { type: Date, default: Date.now },
});

export const MigrationModel = mongoose.model<IMigration>("Migration", MigrationSchema);
