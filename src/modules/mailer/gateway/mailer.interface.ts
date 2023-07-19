export const I_MAILER_SERVICE = Symbol('I_MAILER_SERVICE');

export interface IMailer {
  sendMail(email: Email): Promise<void>;
}

export type Email = {
  to: string;
  subject: string;
  body: string;
};
