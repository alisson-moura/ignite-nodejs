import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKeyInBase64 = env.get('JWT_PRIVATE_KEY');
        const publicKeyInBase64 = env.get('JWT_PUBLIC_KEY');
        return {
          privateKey: Buffer.from(privateKeyInBase64, 'base64'),
          publicKey: Buffer.from(publicKeyInBase64, 'base64'),
          signOptions: { algorithm: 'RS256' },
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    EnvService,
  ],
})
export class AuthModule {}
