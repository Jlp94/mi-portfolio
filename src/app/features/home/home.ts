import { Component, signal, computed, afterNextRender } from '@angular/core';
import { Navbar } from '../../shared/layouts/navbar/navbar';
import { Footer } from '../../shared/layouts/footer/footer';
import { Hero } from '../components/hero/hero';
import { AboutStack } from '../components/about-stack/about-stack';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { Projects } from '../components/projects/projects';
import { Contact } from '../components/contact/contact';

interface BlobConfig {
  top: string;
  left: string;
  sizeMobile: number;
  sizeDesktop: number;
  blurMobile: number;
  blurDesktop: number;
  bg: string;
  opacity: string;
  animation: string;
  fx: number;
  fy: number;
}

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

  private readonly blobConfigs = this.generateBlobs(28);

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

  protected readonly blobs = computed(() => {
    const x = this.mouseX();
    const y = this.mouseY();
    return this.blobConfigs.map((blob) => ({
      ...blob,
      transform: `translate(${x * blob.fx}px, ${y * blob.fy}px)`,
    }));
  });

  protected onMouseMove(event: MouseEvent): void {
    if (typeof window !== 'undefined') {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      this.mouseX.set(x);
      this.mouseY.set(y);
    }
  }

  private generateBlobs(count: number): BlobConfig[] {
    const bgs = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
    const animations = ['float-one', 'float-two', 'float-three', 'float-four', 'float-five'];
    let seed = 98765;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const list: BlobConfig[] = [];
    for (let i = 0; i < count; i++) {
      const top = Math.floor(random() * 95) + '%';
      const left = Math.floor(random() * 104 - 2) + '%';
      const sizeMobile = Math.floor(random() * 5) + 5;
      const sizeDesktop = Math.floor(random() * 8) + 8;
      const blurMobile = Math.floor(random() * 10) + 12;
      const blurDesktop = Math.floor(random() * 15) + 20;

      const bgName = bgs[Math.floor(random() * bgs.length)];
      const bg = `var(--theme-blob-${bgName}-bg)`;
      const opacity = `var(--theme-blob-${bgName}-opacity)`;

      const animName = animations[Math.floor(random() * animations.length)];
      const animDuration = Math.floor(random() * 12) + 18;
      const animDirection = random() > 0.5 ? '' : ' reverse';
      const animation = `${animName} ${animDuration}s ease-in-out infinite${animDirection}`;

      const fx = (random() * 80 + 40) * (random() > 0.5 ? 1 : -1);
      const fy = (random() * 80 + 40) * (random() > 0.5 ? 1 : -1);

      list.push({
        top,
        left,
        sizeMobile,
        sizeDesktop,
        blurMobile,
        blurDesktop,
        bg,
        opacity,
        animation,
        fx,
        fy,
      });
    }
    return list;
  }
}
