import { Email, IMailerService } from './mailer-service.interface';

export class LoopbackMailerService implements IMailerService {
  private sentEmails: Email[] = [];

  async sendMail(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }

  getSentEmails(): Email[] {
    return this.sentEmails;
  }
}
