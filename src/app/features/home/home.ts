import { Component, signal, computed, afterNextRender } from '@angular/core';
import { Navbar } from '../../shared/layouts/navbar/navbar';
import { Footer } from '../../shared/layouts/footer/footer';
import { Hero } from '../components/hero/hero';
import { AboutStack } from '../components/about-stack/about-stack';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { Projects } from '../components/projects/projects';
import { Contact } from '../components/contact/contact';

@Component({
  selector: 'app-home',
  host: {
    '(window:mousemove)': 'onMouseMove($event)',
  },
  imports: [Navbar, Hero, AboutStack, Experience, Education, Projects, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly mouseX = signal(0);
  private readonly mouseY = signal(0);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      });

      afterNextRender(() => {
        const savedScroll = sessionStorage.getItem('scrollPosition');
        if (savedScroll) {
          const scrollY = parseInt(savedScroll, 10);
          setTimeout(() => {
            window.scrollTo(0, scrollY);
          }, 80);
        }
      });
    }
  }

  protected readonly blobStyles = computed(() => {
    const x = this.mouseX();
    const y = this.mouseY();
    return {
      one: { transform: `translate(${x * 120}px, ${y * 120}px)` },
      two: { transform: `translate(${-x * 90}px, ${-y * 90}px)` },
      three: { transform: `translate(${x * 70}px, ${-y * 70}px)` },
      four: { transform: `translate(${-x * 80}px, ${y * 80}px)` },
      five: { transform: `translate(${x * 60}px, ${y * 60}px)` },
      six: { transform: `translate(${-x * 85}px, ${-y * 85}px)` },
      seven: { transform: `translate(${x * 100}px, ${-y * 100}px)` },
      eight: { transform: `translate(${-x * 140}px, ${y * 140}px)` },
      nine: { transform: `translate(${x * 110}px, ${-y * 110}px)` },
      ten: { transform: `translate(${-x * 130}px, ${y * 130}px)` },
      eleven: { transform: `translate(${x * 95}px, ${y * 95}px)` },
      twelve: { transform: `translate(${-x * 75}px, ${-y * 75}px)` },
      thirteen: { transform: `translate(${x * 80}px, ${y * 80}px)` },
      fourteen: { transform: `translate(${-x * 110}px, ${-y * 110}px)` },
    };
  });

  protected onMouseMove(event: MouseEvent): void {
    if (typeof window !== 'undefined') {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      this.mouseX.set(x);
      this.mouseY.set(y);
    }
  }
}
