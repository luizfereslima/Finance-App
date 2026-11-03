import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from '../dtos';
import { TransactionType } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService) {}
  async register(d: RegisterDto) { const email = d.email.toLowerCase(); try { return await this.db.$transaction(async tx => { const user = await tx.user.create({ data: { name: d.name, email, passwordHash: await bcrypt.hash(d.password, 12) } }); const defaults: Array<[string, TransactionType]> = [['Salário', TransactionType.INCOME], ['Outras entradas', TransactionType.INCOME], ['Alimentação', TransactionType.EXPENSE], ['Moradia', TransactionType.EXPENSE], ['Transporte', TransactionType.EXPENSE], ['Lazer', TransactionType.EXPENSE], ['Outras despesas', TransactionType.EXPENSE]]; await tx.category.createMany({ data: defaults.map(([name, type]) => ({ userId: user.id, name, type })) }); return { id: user.id, name: user.name, email: user.email }; }); } catch (e: any) { if (e.code === 'P2002') throw new ConflictException('E-mail já cadastrado'); throw e; } }
  async login(d: LoginDto) { const user = await this.db.user.findUnique({ where: { email: d.email.toLowerCase() } }); if (!user || !(await bcrypt.compare(d.password, user.passwordHash))) throw new UnauthorizedException('E-mail ou senha inválidos'); return { accessToken: this.jwt.sign({ sub: user.id }) }; }
}
