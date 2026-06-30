import { Component, inject, computed, ElementRef, afterNextRender, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { EmailService } from '../../../core/services/email-service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().contact);
  private readonly elementRef = inject(ElementRef);
  private readonly emailService = inject(EmailService);

  // Form signals
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');

  protected readonly submissionStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  protected readonly showValidationError = signal<boolean>(false);

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    afterNextRender(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return;
      }

      const hostElement = this.elementRef.nativeElement;

      const title = hostElement.querySelector('.contact-title');
      const line = hostElement.querySelector('.contact-line');
      const subtitle = hostElement.querySelector('.contact-subtitle');
      const form = hostElement.querySelector('.contact-form');

      // Pre-set initial states for GSAP
      gsap.set(title, { opacity: 0, x: 200 });
      gsap.set(line, { scaleX: 0, transformOrigin: 'right center' });
      gsap.set(subtitle, { opacity: 0, x: 200 });
      gsap.set(form, { opacity: 0, y: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hostElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        delay: 0.2,
      });

      tl.to(title, {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
      })
      .to(line, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.8')
      .to(subtitle, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power2.out',
      }, '-=0.6')
      .to(form, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, '-=0.8');
    });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const nameVal = this.name().trim();
    const emailVal = this.email().trim();
    const messageVal = this.message().trim();

    if (!nameVal || !emailVal || !messageVal) {
      this.showValidationError.set(true);
      setTimeout(() => {
        if (this.showValidationError()) {
          this.showValidationError.set(false);
        }
      }, 5000);
      return;
    }

    this.showValidationError.set(false);
    this.submissionStatus.set('loading');

    const success = await this.emailService.sendEmail(nameVal, emailVal, messageVal);
    if (success) {
      this.submissionStatus.set('success');
      this.name.set('');
      this.email.set('');
      this.message.set('');
      setTimeout(() => {
        if (this.submissionStatus() === 'success') {
          this.submissionStatus.set('idle');
        }
      }, 5000);
    } else {
      this.submissionStatus.set('error');
      setTimeout(() => {
        if (this.submissionStatus() === 'error') {
          this.submissionStatus.set('idle');
        }
      }, 5000);
    }
  }
}
