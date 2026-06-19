import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-scroll-badge',
  imports: [],
  templateUrl: './scroll-badge.html',
  styleUrl: './scroll-badge.css',
})
export class ScrollBadge {
  targetId = input.required<string>();
  text = input<string>('EXPLORA • MI • PORTFOLIO • ');
  isUp = input<boolean>(false);

  protected readonly badgeText = computed(() => {
    return this.isUp() ? 'VOLVER • ARRIBA • ' : this.text();
  });

  protected readonly ariaLabel = computed(() => {
    return this.isUp() ? 'Volver al inicio de la página' : 'Desplazarse a la siguiente sección';
  });
}
