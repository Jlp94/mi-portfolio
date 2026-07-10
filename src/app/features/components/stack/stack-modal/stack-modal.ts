import { Component, inject, computed, ElementRef, signal, input, output, afterNextRender, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { TechIcon } from '../../../../shared/ui/tech-icon/tech-icon';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stack-modal',
  imports: [TechIcon, FaIconComponent],
  templateUrl: './stack-modal.html',
  styleUrl: './stack-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackModal {
  protected readonly languageService = inject(LanguageService);
  protected readonly t = computed(() => this.languageService.translations().stacks);

  category = input.required<string>();
  close = output<void>();

  protected readonly faXmark = faXmark;
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('stackDialog');

  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private isClosing = false;

  protected readonly categories = [
    {
      key: 'frontend',
      techs: [
        'angular',
        'typescript',
        'rxjs',
        'html',
        'css',
        'scss',
        'bootstrap',
        'tailwind',
        'primeng',
        'gsap',
      ],
    },
    {
      key: 'backend',
      techs: [
        'spring',
        'springboot',
        'java',
        'jwt',
        'mongodb',
        'postgres',
        'mysql',
        'rabbitmq',
        'kafka',
      ],
    },
    {
      key: 'tools',
      techs: ['git', 'github', 'docker', 'azure', 'vercel', 'render', 'aws', 'kubernetes'],
    },
  ];

  constructor() {
    afterNextRender(() => {
      const dialog = this.dialogRef()?.nativeElement;
      if (dialog && !dialog.open) {
        dialog.showModal();
        if (typeof document !== 'undefined') {
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
        }
      }
    });
  }

  protected onClose(): void {
    if (this.isClosing) return;
    this.isClosing = true;

    const dialog = this.dialogRef()?.nativeElement;
    if (dialog && dialog.open) {
      let hasEmitted = false;
      const cleanup = () => {
        if (hasEmitted) return;
        hasEmitted = true;
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
        this.close.emit();
      };

      dialog.addEventListener('transitionend', cleanup, { once: true });
      dialog.close();

      // Fallback para navegadores sin soporte de transiciones discretas
      setTimeout(() => {
        dialog.removeEventListener('transitionend', cleanup);
        cleanup();
      }, 400);
    } else {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      this.close.emit();
    }
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.onClose();
  }

  protected onDialogClick(event: MouseEvent): void {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (event.target === dialog) {
      this.onClose();
    }
  }

  protected getCategoryTitle(key: string): string {
    const translations = this.t();
    if (key === 'frontend') return translations.frontend;
    if (key === 'backend') return translations.backend;
    if (key === 'tools') return translations.tools;
    return key;
  }

  protected getTechName(key: string): string {
    const techs = this.t().technologies as unknown as Record<string, string>;
    return techs[key] || key;
  }

  protected getCategoryDesc(key: string): string {
    const translations = this.t() as unknown as Record<string, string>;
    if (key === 'frontend') return translations['frontendDesc'] || '';
    if (key === 'backend') return translations['backendDesc'] || '';
    if (key === 'tools') return translations['toolsDesc'] || '';
    return '';
  }

  protected getSplitTechDesc(key: string): string {
    return this.getSplitText(this.getCategoryDesc(key));
  }

  protected getSplitText(text: string): string {
    return text
      .split(' ')
      .map((word) => {
        if (!word) return '';
        const chars = word
          .split('')
          .map((char) => `<span class="split-char">${char}</span>`)
          .join('');
        return `<span class="split-word">${chars}</span>`;
      })
      .join(' ');
  }

  protected hasExtraDetails(key: string): boolean {
    return key === 'frontend' || key === 'backend' || key === 'tools';
  }

  protected getFirstBlockTitle(): string {
    const translations = this.t() as unknown as Record<string, string>;
    return translations['ecosystemTitle'] || 'Ecosistema:';
  }

  protected getSecondBlockTitle(key: string): string {
    const translations = this.t() as unknown as Record<string, string>;
    if (key === 'frontend') {
      return translations['librariesTitle'] || 'Librerías:';
    }
    if (key === 'backend' || key === 'tools') {
      return (translations['learningTitle'] || 'Aprendiendo') + ':';
    }
    return '';
  }

  protected getEcosystem(key: string): readonly string[] {
    const translations = this.t() as unknown as Record<string, readonly string[]>;
    return translations[`${key}Ecosystem`] || [];
  }

  protected getSecondBlockItems(key: string): readonly string[] {
    const translations = this.t() as unknown as Record<string, readonly string[]>;
    if (key === 'frontend') {
      return translations['frontendLibraries'] || [];
    }
    if (key === 'backend') {
      return translations['backendLearning'] || [];
    }
    if (key === 'tools') {
      return translations['toolsLearning'] || [];
    }
    return [];
  }

  protected getThirdBlockTitle(key: string): string {
    const translations = this.t() as unknown as Record<string, string>;
    if (key === 'frontend') {
      return translations['futureTitle'] || 'A futuro:';
    }
    return '';
  }

  protected getThirdBlockItems(key: string): readonly string[] {
    const translations = this.t() as unknown as Record<string, readonly string[]>;
    if (key === 'frontend') {
      return translations['frontendLearning'] || [];
    }
    return [];
  }

  protected getCategoryTechs(key: string): string[] {
    const cat = this.categories.find((c) => c.key === key);
    return cat ? cat.techs : [];
  }

  protected onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
  }

  protected onTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartX);
    const deltaY = Math.abs(touch.clientY - this.touchStartY);
    const deltaTime = Date.now() - this.touchStartTime;

    const TAP_THRESHOLD_PX = 10;
    const TAP_THRESHOLD_MS = 300;

    if (deltaX < TAP_THRESHOLD_PX && deltaY < TAP_THRESHOLD_PX && deltaTime < TAP_THRESHOLD_MS) {
      const target = event.target as HTMLElement;

      if (target.closest('.detail-content-side, .detail-close-btn, .icons-compact, a, button')) {
        return;
      }

      this.onClose();
    }
  }
}
