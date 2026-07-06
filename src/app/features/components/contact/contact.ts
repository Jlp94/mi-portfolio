import { Component, inject, computed, ElementRef, afterNextRender, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  form,
  schema,
  required,
  validate,
  FormRoot,
  FormField,
  submit,
} from '@angular/forms/signals';
import { LanguageService } from '../../../core/services/language.service';
import { EmailService } from '../../../core/services/email-service';
import { FormValidators } from '../../../validators/FormValidators';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ButtonFill1 } from '../../../shared/components/button-fill-1/button-fill-1';

interface CardLayout {
  gridColumn: string;
  gridRow: string;
}



@Component({
  selector: 'app-contact',
  imports: [FormRoot, FormField, ButtonFill1],
  providers: [EmailService],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().contact);
  private readonly elementRef = inject(ElementRef);
  private readonly emailService = inject(EmailService);

  protected readonly formModel = signal({ name: '', email: '', message: '' });

  protected readonly contactForm = form(
    this.formModel,
    schema((p) => {
      required(p.name, { error: { kind: 'validationError' } });
      validate(p.name, (ctx) => {
        const control = new FormControl(ctx.value());
        return FormValidators.notOnlyWhiteSpace(control) ? { kind: 'validationError' } : null;
      });

      required(p.email, { error: { kind: 'validationError' } });
      validate(p.email, (ctx) => {
        const control = new FormControl(ctx.value());
        return FormValidators.strictEmail(control) ? { kind: 'emailInvalid' } : null;
      });

      required(p.message, { error: { kind: 'validationError' } });
      validate(p.message, (ctx) => {
        const control = new FormControl(ctx.value());
        return FormValidators.notOnlyWhiteSpace(control) ? { kind: 'validationError' } : null;
      });
    }),
  );

  protected readonly submissionStatus = signal<'idle' | 'success' | 'error'>('idle');

  protected readonly activeLayout = signal<CardLayout[]>([
    { gridColumn: '2 / 3', gridRow: '1 / 2' },
    { gridColumn: '2 / 4', gridRow: '2 / 3' },
    { gridColumn: '3 / 4', gridRow: '1 / 2' },
    { gridColumn: '1 / 2', gridRow: '1 / 3' },
  ]);

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
      const formEl = hostElement.querySelector('.contact-form');

      gsap.set(title, { opacity: 0, x: 200 });
      gsap.set(line, { scaleX: 0, transformOrigin: 'right center' });
      gsap.set(subtitle, { opacity: 0, x: 200 });
      gsap.set(formEl, { opacity: 0, y: 50 });

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
        .to(
          line,
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.8',
        )
        .to(
          subtitle,
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            ease: 'power2.out',
          },
          '-=0.6',
        )
        .to(
          formEl,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
          },
          '-=0.8',
        );
    });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.contactForm().invalid()) {
      this.contactForm().markAsTouched();
      return;
    }

    this.submissionStatus.set('idle');

    const { name, email, message } = this.formModel();
    const success = await submit(this.contactForm, {
      action: async () => {
        const emailSent = await this.emailService.sendEmail(name, email, message);
        if (!emailSent) {
          return { kind: 'submitError' };
        }
        return null;
      },
    });

    if (success) {
      this.submissionStatus.set('success');
      this.formModel.set({ name: '', email: '', message: '' });
      this.contactForm().reset();
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
