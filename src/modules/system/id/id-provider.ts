export const I_ID_PROVIDER = Symbol('I_ID_PROVIDER');

export interface IIDProvider {
  getId(): string;
}
