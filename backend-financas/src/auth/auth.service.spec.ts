import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  const db = { user: { findUnique: jest.fn(), create: jest.fn() }, category: { createMany: jest.fn() }, $transaction: jest.fn() } as unknown as PrismaService;
  const jwt = { sign: jest.fn().mockReturnValue('token') } as unknown as JwtService;
  let service: AuthService;
  beforeEach(() => { jest.clearAllMocks(); service = new AuthService(db, jwt); });

  it('normaliza o email, cria hash e categorias padrão', async () => {
    const user = { id: 'u1', name: 'Maria', email: 'maria@example.com' };
    (db.$transaction as jest.Mock).mockImplementation(async (callback) => callback({ user: { create: jest.fn().mockResolvedValue(user) }, category: { createMany: jest.fn() } }));
    const result = await service.register({ name: 'Maria', email: 'MARIA@EXAMPLE.COM', password: 'senha1234' });
    expect(result).toEqual(user);
    expect(bcrypt.compare('senha1234', await bcrypt.hash('senha1234', 1))).resolves.toBe(true);
  });

  it('retorna token no login válido', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', passwordHash: await bcrypt.hash('senha1234', 1) });
    await expect(service.login({ email: 'USER@example.com', password: 'senha1234' })).resolves.toEqual({ accessToken: 'token' });
    expect(jwt.sign).toHaveBeenCalledWith({ sub: 'u1' });
  });

  it('usa a mesma exceção para email inexistente e senha incorreta', async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.login({ email: 'x@example.com', password: 'errada' })).rejects.toBeInstanceOf(UnauthorizedException);
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', passwordHash: await bcrypt.hash('correta123', 1) });
    await expect(service.login({ email: 'x@example.com', password: 'errada' })).rejects.toThrow('E-mail ou senha inválidos');
  });

  it('converte conflito de email em 409', async () => {
    (db.$transaction as jest.Mock).mockRejectedValue({ code: 'P2002' });
    await expect(service.register({ name: 'Maria', email: 'maria@example.com', password: 'senha1234' })).rejects.toBeInstanceOf(ConflictException);
  });
});
