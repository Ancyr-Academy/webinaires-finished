export type Props = {
  id: string;
  organizer: {
    id: string;
    emailAddress: string;
  };
  seats: {
    available: number;
    total: number;
  };
  startAt: Date;
  endAt: Date;
};

export class WebinaireReadModel {
  public readonly id: string;
  public readonly organizer: {
    id: string;
    emailAddress: string;
  };
  public readonly seats: {
    available: number;
    total: number;
  };
  public readonly startAt: Date;
  public readonly endAt: Date;

  constructor(props: Props) {
    this.id = props.id;
    this.organizer = props.organizer;
    this.seats = props.seats;
    this.startAt = props.startAt;
    this.endAt = props.endAt;
  }
}
