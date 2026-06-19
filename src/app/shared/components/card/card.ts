import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shared-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class SharedCard {
  glowColor = input<string>('sky');
  clickable = input<boolean>(false);
}
