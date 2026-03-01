// tests/unit/auth.test.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth utilities', () => {
  describe('Password hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'MyPassword123!';
      const hash = await bcrypt.hash(password, 12);
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2a$')).toBe(true);
    });

    it('should verify correct password', async () => {
      const password = 'MyPassword123!';
      const hash = await bcrypt.hash(password, 12);
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hash = await bcrypt.hash('correctpassword', 12);
      const isValid = await bcrypt.compare('wrongpassword', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT tokens', () => {
    const secret = 'test-secret';

    it('should create a valid token', () => {
      const token = jwt.sign({ id: '123', email: 'test@test.com', role: 'customer' }, secret);
      expect(token).toBeTruthy();
      const decoded = jwt.verify(token, secret) as { id: string; email: string };
      expect(decoded.id).toBe('123');
      expect(decoded.email).toBe('test@test.com');
    });

    it('should reject invalid token', () => {
      expect(() => jwt.verify('invalid.token.here', secret)).toThrow();
    });

    it('should reject token with wrong secret', () => {
      const token = jwt.sign({ id: '123' }, 'wrong-secret');
      expect(() => jwt.verify(token, secret)).toThrow();
    });
  });
});
