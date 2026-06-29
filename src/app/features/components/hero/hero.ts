import { Component, inject } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-hero',
  imports: [FaIconComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly languageService = inject(LanguageService);
  protected readonly faFilePdf = faFilePdf;
}
