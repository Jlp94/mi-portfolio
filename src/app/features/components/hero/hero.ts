import { Component, inject, signal } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { CodeTag } from '../../../shared/components/code-tag/code-tag';

@Component({
  selector: 'app-hero',
  imports: [FaIconComponent, CodeTag],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly languageService = inject(LanguageService);
  protected readonly faFilePdf = faFilePdf;
  protected readonly isAvailableForWork = signal(true);
}
