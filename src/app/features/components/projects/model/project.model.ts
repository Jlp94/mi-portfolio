export type FilterKey = 'all' | 'angular' | 'spring' | 'nest' | 'php';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  techs: string[];
  images: string[];
  repoUrl?: string;
  cardImage?: string;
}

export interface CardLayout {
  gridColumn: string;
  gridRow: string;
}

export const TECH_KEY_MAP: Record<string, string | null> = {
  Angular: 'angular',
  Ionic: 'ionic',
  TypeScript: 'typescript',
  'Tailwind CSS': 'tailwind',
  'Chart.js': 'chartjs',
  'Spring Boot': 'springboot',
  'Spring Modulith': 'spring-modulith',
  Java: 'java',
  JWT: 'jwt',
  RxJS: 'rxjs',
  Swiper: 'swiper',
  Bootstrap: 'bootstrap',
  JavaScript: 'javascript',
  HTML5: 'html',
  CSS: 'css',
  SCSS: 'scss',
  PHP: 'php',
  CodeIgniter: 'codeigniter',
  PostgreSQL: 'postgres',
  Docker: 'docker',
  MongoDB: 'mongodb',
  MySQL: 'mysql',
  PrimeNG: 'primeng',
  NestJS: 'nestjs',
  Vitest: 'vitest',
  GSAP: null,
  Swagger: 'swagger',
};
