# 🚀 Mi Portfolio Profesional

Este proyecto es un sitio web personal interactivo, dinámico y premium diseñado para presentar mi trayectoria, stack tecnológico, proyectos y formas de contacto. Construido con una arquitectura moderna y animaciones fluidas de última generación.

Autor: **Jose Luis Prieto** ([jlpcdr94@gmail.com](mailto:jlpcdr94@gmail.com))

🔗 **Demo en vivo**: [jlp94.github.io/mi-portfolio](https://jlp94.github.io/mi-portfolio/)

---

## 🌟 Características Principales

*   **⚡ Arquitectura Moderna (Angular v22)**: Implementa las últimas novedades de Angular, como *Standalone Components*, *Signal Inputs*, control reactivo de formularios con *Signal Forms*, y el patrón de inyección de dependencias `inject()`.
*   **🎭 Animaciones Premium (GSAP & GSAP Flip)**: Integración de animaciones fluidas con GreenSock:
    *   **GSAP Flip**: Transiciones suaves al expandir categorías en el visor de tecnologías.
    *   **ScrollTrigger**: Carga animada y progresiva de componentes según el scroll del usuario (adaptado tanto a scroll vertical como a scroll horizontal de paneles en desktop).
    *   **Hover Dinámico y Elástico**: Efectos de hover direccional magnético en botones e interacciones elásticas letra por letra en títulos principales.
*   **🎨 Diseño Premium Integrado**:
    *   Soporte completo para **Modo Claro** y **Modo Oscuro** con transiciones de color ultra suaves.
    *   **Bento Grid de Intereses**: Visualización moderna y adaptable con layouts aleatorios en cada recarga de página.
    *   Estética cuidada con variables CSS (diseño responsivo, sombras fluidas y fondo granulado dinámico en los paneles desplegados).
*   **🌐 Soporte Multiidioma**: Traducciones nativas instantáneas (Español / Inglés) sin recargar la página, gestionadas mediante servicios y señales reactivas.
*   **✉️ Formulario de Contacto Interactivo**: Formulario integrado con validación en tiempo real y servicio de envío de correos automatizado.

---

## 🛠️ Tecnologías y Librerías Utilizadas

*   **Core**: [Angular 22](https://angular.dev/) & [TypeScript](https://www.typescriptlang.org/)
*   **Estilos**: Vanilla CSS y [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animaciones**: [GSAP (GreenSock Animation Platform)](https://gsap.com/)
*   **Iconos**: [FontAwesome SVG Icons](https://fortawesome.github.io/Font-Awesome/) y [PrimeIcons](https://primefaces.org/primeicons/)
*   **Pruebas unitarias**: [Vitest](https://vitest.dev/)
*   **Gestor de Paquetes**: [pnpm](https://pnpm.io/)

---

## 🚀 Instalación y Desarrollo Local

Este proyecto utiliza **pnpm** como gestor de dependencias preferido.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jlp94/mi-portfolio.git
cd mi-portfolio
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Servidor de desarrollo
Para iniciar la aplicación en modo de desarrollo local:
```bash
pnpm start
```
Abre tu navegador en `http://localhost:4200/`. El proyecto cuenta con recarga en caliente (*hot reload*), por lo que cualquier cambio en los archivos fuente se actualizará automáticamente.

---

## 📦 Comandos Disponibles

*   `pnpm start`: Levanta el servidor local de desarrollo (`ng serve`).
*   `pnpm build`: Compila la aplicación y genera los archivos de producción en la carpeta `dist/`.
*   `pnpm test`: Ejecuta los tests unitarios con [Vitest](https://vitest.dev/) (`ng test`).
*   `pnpm lint`: Realiza el análisis estático del código (`ng lint`) para asegurar los estándares de calidad.
*   `pnpm deploy`: Compila la aplicación y la despliega automáticamente en GitHub Pages.

---

## 📂 Estructura del Proyecto

*   `src/app/core/`: Constantes globales, traducciones (`translations.ts`) y servicios transversales (idioma, tema, correos).
*   `src/app/features/`: Componentes principales de la vista única (`hero`, `about-me`, `stack`, `experience`, `education`, `projects`, `contact`).
*   `src/app/shared/`: Layouts comunes (navbar, footer), componentes genéricos (code-tag, section) y validadores personalizados.
*   `src/styles.css`: Hoja de estilos global, tokens de diseño y animaciones base.
