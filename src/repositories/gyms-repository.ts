import { Gym } from "@prisma/client";

export interface GymsRepo {
  findById(gymId: string): Promise<Gym | null>;
}
