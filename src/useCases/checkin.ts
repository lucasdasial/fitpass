import { CheckInsRepo } from "@/repositories/check-ins-repository";
import { GymsRepo } from "@/repositories/gyms-repository";
import { IUserRepository } from "@/repositories/users-repository";
import { getDistanceBetweenCoordinates } from "@/utils/getDistanceCoordinate";
import { CheckIn } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkInsRepo: CheckInsRepo, private gymRepo: GymsRepo) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepo.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new Error();
    }

    const checkInOnSameDay = await this.checkInsRepo.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepo.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
