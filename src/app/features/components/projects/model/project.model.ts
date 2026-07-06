export type FilterKey = 'all' | 'angular' | 'spring' | 'nest' | 'php';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  techs: string[];
  images: string[];
  repoUrl: string;
}

export interface CardLayout {
  gridColumn: string;
  gridRow: string;
}

export const TECH_KEY_MAP: Record<string, string | null> = {
  Angular: 'angular',
  TypeScript: 'typescript',
  'Tailwind CSS': 'tailwind',
  'Spring Boot': 'springboot',
  Java: 'java',
  JWT: 'jwt',
  RxJS: 'rxjs',
  Bootstrap: 'bootstrap',
  JavaScript: 'javascript',
  HTML5: 'html',
  SCSS: 'scss',
  PHP: 'php',
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
