import { FormControl, FormGroup } from '@angular/forms';
import { FormValidators } from './FormValidators';

describe('FormValidators — Blindaje contra inyección y edge cases', () => {

  describe('notOnlyWhiteSpace', () => {
    it('debería rechazar un campo con solo espacios en blanco', () => {
      const control = new FormControl('     ');
      expect(FormValidators.notOnlyWhiteSpace(control)).toEqual({ notOnlyWhiteSpace: true });
    });

    it('debería rechazar un campo con tabuladores y saltos de línea', () => {
      const control = new FormControl('\t\n  \r');
      expect(FormValidators.notOnlyWhiteSpace(control)).toEqual({ notOnlyWhiteSpace: true });
    });

    it('debería aceptar un campo con texto real', () => {
      const control = new FormControl('Jose Luis');
      expect(FormValidators.notOnlyWhiteSpace(control)).toBeNull();
    });

    it('debería aceptar null sin explotar', () => {
      const control = new FormControl(null);
      expect(FormValidators.notOnlyWhiteSpace(control)).toBeNull();
    });

    it('debería aceptar un campo con texto rodeado de espacios (no es SOLO espacios)', () => {
      const control = new FormControl('   a   ');
      expect(FormValidators.notOnlyWhiteSpace(control)).toBeNull();
    });
  });

  describe('strictEmail', () => {
    it('debería aceptar un email válido estándar', () => {
      const control = new FormControl('jose@nunsys.com');
      expect(FormValidators.strictEmail(control)).toBeNull();
    });

    it('debería rechazar un email sin dominio', () => {
      const control = new FormControl('jose@');
      expect(FormValidators.strictEmail(control)).toEqual({ strictEmail: true });
    });

    it('debería rechazar un email sin arroba', () => {
      const control = new FormControl('josenunsys.com');
      expect(FormValidators.strictEmail(control)).toEqual({ strictEmail: true });
    });

    it('debería rechazar inyección de script en el email', () => {
      const control = new FormControl('<script>alert("xss")</script>@evil.com');
      expect(FormValidators.strictEmail(control)).toEqual({ strictEmail: true });
    });

    it('debería rechazar SQL injection en el email', () => {
      const control = new FormControl("'; DROP TABLE users; --@evil.com");
      expect(FormValidators.strictEmail(control)).toEqual({ strictEmail: true });
    });

    it('debería aceptar null sin explotar', () => {
      const control = new FormControl(null);
      expect(FormValidators.strictEmail(control)).toBeNull();
    });

    it('debería aceptar cadena vacía sin explotar', () => {
      const control = new FormControl('');
      expect(FormValidators.strictEmail(control)).toBeNull();
    });
  });

  describe('passwordMatch', () => {
    it('debería aceptar contraseñas iguales', () => {
      const group = new FormGroup({
        password: new FormControl('Abc123!'),
        confirmPassword: new FormControl('Abc123!')
      });
      expect(FormValidators.passwordMatch(group)).toBeNull();
    });

    it('debería rechazar contraseñas diferentes', () => {
      const group = new FormGroup({
        password: new FormControl('Abc123!'),
        confirmPassword: new FormControl('diferente')
      });
      expect(FormValidators.passwordMatch(group)).toEqual({ passwordMismatch: true });
    });

    it('debería rechazar si confirmPassword está vacío', () => {
      const group = new FormGroup({
        password: new FormControl('Abc123!'),
        confirmPassword: new FormControl('')
      });
      expect(FormValidators.passwordMatch(group)).toEqual({ passwordMismatch: true });
    });

    it('debería detectar la diferencia aunque solo cambie mayúscula/minúscula', () => {
      const group = new FormGroup({
        password: new FormControl('abc123'),
        confirmPassword: new FormControl('ABC123')
      });
      expect(FormValidators.passwordMatch(group)).toEqual({ passwordMismatch: true });
    });
  });

  describe('maxBase64Size', () => {
    const validator = FormValidators.maxBase64Size(100);

    it('debería aceptar null/vacío sin explotar', () => {
      expect(validator(new FormControl(null))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('debería aceptar un base64 pequeño dentro del límite', () => {
      const smallBase64 = 'data:image/png;base64,abc';
      expect(validator(new FormControl(smallBase64))).toBeNull();
    });

    it('debería rechazar un base64 que exceda el límite', () => {
      const bigBase64 = 'x'.repeat(200);
      expect(validator(new FormControl(bigBase64))).toEqual({ maxBase64Size: true });
    });
  });
});
