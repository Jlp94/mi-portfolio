import { Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service({
  autoProvided: false,
})
export class EmailService {
  private readonly formspreeId: string = environment.formspreeId;

  async sendEmail(name: string, email: string, message: string): Promise<boolean> {
    if (!this.formspreeId || this.formspreeId === 'YOUR_FORMSPREE_ID') {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return true;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${this.formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
