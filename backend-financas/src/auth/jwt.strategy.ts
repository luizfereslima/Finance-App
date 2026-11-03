import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

function extractCookie(request: { headers: { cookie?: string } }) {
  const cookies = request.headers.cookie?.split(';') ?? [];
  const accessToken = cookies.find((cookie) => cookie.trim().startsWith('access_token='));
  return accessToken ? decodeURIComponent(accessToken.split('=').slice(1).join('=').trim()) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }
  validate(payload: { sub: string }) { return { userId: payload.sub, sub: payload.sub }; }
}
