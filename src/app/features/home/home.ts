import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Navbar } from '../../shared/layouts/navbar/navbar';
import { Footer } from '../../shared/layouts/footer/footer';
import { Hero } from '../components/hero/hero';
import { AboutStack } from '../components/about-stack/about-stack';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { Projects } from '../components/projects/projects';
import { Contact } from '../components/contact/contact';

interface Trace {
  points: { x: number; y: number }[];
  phase: number;
  period: number;
  baseAlpha: number;
  peakAlpha: number;
  vx: number;
  vy: number;
  color: string;
  lineWidth: number;
}

@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, AboutStack, Experience, Education, Projects, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  @ViewChild('meteorCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private destroyRef = inject(DestroyRef);
  private ctx!: CanvasRenderingContext2D;
  private traces: Trace[] = [];
  private animFrameId = 0;
  private isDark = false;
  private mouse = { x: -9999, y: -9999 };

  private readonly LIGHT_COLORS = [
    '#2dd4bf',
    '#818cf8',
    '#a78bfa',
    '#38bdf8',
    '#6ee7b7',
    '#93c5fd',
  ];

  private readonly DARK_COLORS = [
    '#fb7185',
    '#e879f9',
    '#a78bfa',
    '#f472b6',
    '#c084fc',
    '#f43f5e',
    '#ffffff',
    '#e2e8f0',
  ];

  constructor() {
    afterNextRender(() => {
      this.setupCanvas();
      this.generateTraces();
      this.bindEvents();
      this.loop(0);
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      });
    }
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.watchTheme();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private bindEvents(): void {
    const onMouseMove = (e: MouseEvent) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    };
    const onResize = () => {
      this.resizeCanvas();
      this.generateTraces();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    });
  }

  private watchTheme(): void {
    const update = () => {
      const wasDark = this.isDark;
      this.isDark = document.documentElement.classList.contains('dark');
      if (this.isDark !== wasDark) {
        this.generateTraces();
      }
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    this.destroyRef.onDestroy(() => obs.disconnect());
  }

  private get palette(): string[] {
    return this.isDark ? this.DARK_COLORS : this.LIGHT_COLORS;
  }

  private get traceCount(): number {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return Math.min(60, Math.max(28, Math.round((w * h) / 18000)));
  }

  private generateTraces(): void {
    this.traces = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pal = this.palette;

    for (let i = 0; i < this.traceCount; i++) {
      const startX = Math.random() * w;
      const startY = Math.random() * h;
      const points: { x: number; y: number }[] = [{ x: startX, y: startY }];

      const segments = 2 + Math.floor(Math.random() * 4);
      let dir = Math.floor(Math.random() * 4);

      for (let s = 0; s < segments; s++) {
        if (Math.random() < 0.4) {
          dir = (dir + (Math.random() < 0.5 ? 1 : -1) + 4) % 4;
        }
        const len = 80 + Math.random() * 200;
        const last = points[points.length - 1];
        let nx = last.x;
        let ny = last.y;
        if (dir === 0) nx += len;
        else if (dir === 1) ny += len;
        else if (dir === 2) nx -= len;
        else ny -= len;
        points.push({ x: nx, y: ny });
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.18 + Math.random() * 0.28;

      this.traces.push({
        points,
        phase: Math.random() * Math.PI * 2,
        period: 4000 + Math.random() * 6000,
        baseAlpha: 0.07 + Math.random() * 0.05,
        peakAlpha: 0.22 + Math.random() * 0.14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: pal[Math.floor(Math.random() * pal.length)],
        lineWidth: 0.8 + Math.random() * 1.0,
      });
    }
  }

  private scrollFactor(): number {
    const fadeDistance = window.innerHeight * 0.85;
    const t = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
    return 1 - t * t;
  }

  private distToSegment(
    px: number,
    py: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
  ): number {
    const dx = bx - ax,
      dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  private moveTrace(trace: Trace): void {
    for (const p of trace.points) {
      p.x += trace.vx;
      p.y += trace.vy;
    }

    const margin = 250;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const xs = trace.points.map((p) => p.x);
    const ys = trace.points.map((p) => p.y);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs);
    const minY = Math.min(...ys),
      maxY = Math.max(...ys);

    let shiftX = 0,
      shiftY = 0;
    if (maxX < -margin) shiftX = w + margin * 2;
    if (minX > w + margin) shiftX = -(w + margin * 2);
    if (maxY < -margin) shiftY = h + margin * 2;
    if (minY > h + margin) shiftY = -(h + margin * 2);

    if (shiftX || shiftY) {
      for (const p of trace.points) {
        p.x += shiftX;
        p.y += shiftY;
      }
    }
  }

  private drawTrace(trace: Trace, now: number, sf: number): void {
    const ctx = this.ctx;
    const { mouse } = this;

    const wave = (Math.sin((now / trace.period) * Math.PI * 2 + trace.phase) + 1) / 2;

    let minDist = Infinity;
    for (let i = 1; i < trace.points.length; i++) {
      const d = this.distToSegment(
        mouse.x,
        mouse.y,
        trace.points[i - 1].x,
        trace.points[i - 1].y,
        trace.points[i].x,
        trace.points[i].y,
      );
      if (d < minDist) minDist = d;
    }
    const highlight = Math.max(0, 1 - minDist / 180);

    const baseWaveAlpha = trace.baseAlpha + wave * (trace.peakAlpha - trace.baseAlpha);
    const alpha = Math.min(0.95, baseWaveAlpha * sf + highlight * 0.65);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(trace.points[0].x, trace.points[0].y);
    for (let i = 1; i < trace.points.length; i++) {
      ctx.lineTo(trace.points[i].x, trace.points[i].y);
    }
    ctx.strokeStyle = trace.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = trace.lineWidth;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.stroke();
    ctx.restore();
  }

  private loop = (now: number): void => {
    this.animFrameId = requestAnimationFrame(this.loop);

    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);

    const sf = this.scrollFactor();

    for (const trace of this.traces) {
      this.moveTrace(trace);
      this.drawTrace(trace, now, sf);
    }
  };
}
