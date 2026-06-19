import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shared-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class SharedBadge {
  color = input<string>('slate');
}
