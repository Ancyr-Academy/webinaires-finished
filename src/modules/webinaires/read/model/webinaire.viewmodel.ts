export type WebinaireViewModelType = {
  id: string;
  organizer: {
    id: string;
    name: string;
    emailAddress: string;
  };
  seats: {
    available: number;
    total: number;
  };
  startAt: Date;
  endAt: Date;
};

export class WebinaireViewModel {
  constructor(public readonly props: WebinaireViewModelType) {}
}
