import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}
  findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email: email.toLowerCase() } });
  }
  findById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }
}
