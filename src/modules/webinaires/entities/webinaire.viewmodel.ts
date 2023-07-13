export type WebinaireViewModelType = {
  id: string;
  organizerId: string;
  seats: {
    available: number;
    total: number;
  };
  startAt: Date;
  endAt: Date;
};

export class WebinaireViewModel {
  constructor(public readonly data: WebinaireViewModelType) {}

  isFull(): boolean {
    return this.data.seats.available === 0;
  }
}
