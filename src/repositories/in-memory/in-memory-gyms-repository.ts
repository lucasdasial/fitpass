import { Prisma, Gym } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { GymsRepo } from "../gyms-repository";
import { IUserRepository } from "../users-repository";

export class InMemoryGymsRepository implements GymsRepo {
  public items: Gym[] = [];
  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === gymId);

    if (!gym) {
      return null;
    }

    this.items.push(gym);
    return gym;
  }
}
