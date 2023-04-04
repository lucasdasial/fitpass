import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./checkin";

let checkInRepo: InMemoryCheckInRepository;
let gymRepo: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInRepo = new InMemoryCheckInRepository();
    gymRepo = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepo, gymRepo);

    gymRepo.items.push({
      id: "sino",
      title: "sino gym",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "sino",
      userId: "ash",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //@-1.4809016,-48.4901839,15z
  //@-1.4320371,-48.4672874,15z
  it("should not be able to check in on distant gym", async () => {
    gymRepo.items.push({
      id: "sino2",
      title: "sino2 gym",
      description: "",
      phone: "",
      latitude: new Decimal(-1.4809016),
      longitude: new Decimal(-48.4901839),
    });

    await expect(() =>
      sut.execute({
        gymId: "sino2",
        userId: "ash",
        userLatitude: -1.4320371,
        userLongitude: -48.467287,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to double check in same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "sino",
      userId: "ash",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(
      sut.execute({
        gymId: "sino",
        userId: "ash",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to double check in different day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "sino",
      userId: "ash",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
