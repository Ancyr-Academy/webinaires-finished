import { Email, IMailer } from '../gateway/mailer.interface';

export class LoopbackMailer implements IMailer {
  private sentEmails: Email[] = [];

  async sendMail(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }

  getSentEmails(): Email[] {
    return this.sentEmails;
  }
}
