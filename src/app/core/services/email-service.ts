import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly formspreeId: string = environment.formspreeId;

  async sendEmail(name: string, email: string, message: string): Promise<boolean> {
    if (!this.formspreeId || this.formspreeId === 'YOUR_FORMSPREE_ID') {
      console.warn('Formspree ID no configurado. Simulando envío de red de 1.2 segundos...');
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
    } catch (error) {
      console.error('Error al enviar el email:', error);
      return false;
    }
  }
}
