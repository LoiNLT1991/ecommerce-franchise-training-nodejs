import { IUserContext } from "@/types/auth";

export {}; // 🔴 BẮT BUỘC

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        context: IUserContext | null;
        version: number;
      };
    }
  }
}
