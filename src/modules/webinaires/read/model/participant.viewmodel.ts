export type ParticipantViewModelType = {
  id: string;
  name: string;
  emailAddress: string;
};

export class ParticipantViewModel {
  constructor(public readonly props: ParticipantViewModelType) {}
}
