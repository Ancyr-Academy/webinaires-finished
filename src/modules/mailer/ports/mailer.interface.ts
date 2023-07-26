export const I_MAILER = Symbol('I_MAILER');

export interface IMailer {
  sendMail(email: Email): Promise<void>;
}

export type Email = {
  to: string;
  subject: string;
  body: string;
};
