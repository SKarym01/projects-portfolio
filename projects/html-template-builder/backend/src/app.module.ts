import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailTemplateModule } from './email_template/email_template.module';
import { PlaceholderModule } from './placeholders/placeholder.module';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AuthGuard,
  KeycloakConnectModule,
  RoleGuard,
} from 'nest-keycloak-connect';

import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Makes environment variables globally available
    ConfigModule.forRoot({ isGlobal: true }),

    // Application feature modules
    EmailTemplateModule,
    PlaceholderModule,

    // Database configuration using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('db_host'),
        port: configService.get<number>('db_port'),
        username: configService.get<string>('db_username'),
        password: configService.get<string>('db_password'),
        database: configService.get<string>('db'),
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true, // Runs migrations automatically on startup
        logging: ['query', 'error'], // Logs DB queries and errors for debugging
      }),
    }),

    // Keycloak integration for authentication and authorization
    KeycloakConnectModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          realm: configService.get<string>('kc_realm'),
          authServerUrl: configService.get<string>('kc_authServerUrl'),
          resource: configService.get<string>('kc_clientId'),
          secret: configService.get<string>('kc_secret'),
          bearerOnly: true, // App uses only access tokens (no login redirect)
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Global guards for securing routes with Keycloak
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
