import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from '../env';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKeyInBase64 = config.get('JWT_PRIVATE_KEY', {
          infer: true,
        });
        const publicKeyInBase64 = config.get('JWT_PUBLIC_KEY', { infer: true });
        return {
          privateKey: Buffer.from(privateKeyInBase64, 'base64'),
          publicKey: Buffer.from(publicKeyInBase64, 'base64'),
          signOptions: { algorithm: 'RS256' },
        };
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
