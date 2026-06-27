import { Component, input } from '@angular/core';
import { CodeTag } from '../code-tag/code-tag';

@Component({
  selector: 'app-shared-section',
  imports: [CodeTag],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class SharedSection {
  id = input.required<string>();
  title = input<string>('');
  subtitle = input<string>();
  maxWidth = input<string>('max-w-6xl');
  heightClass = input<string>('min-h-screen flex flex-col justify-center py-20');
}
