import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shared-section',
  imports: [],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class SharedSection {
  id = input.required<string>();
  title = input.required<string>();
  subtitle = input<string>();
}
