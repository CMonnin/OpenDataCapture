import { CryptoModule, LoggingModule } from '@douglasneuroinformatics/libnest/modules';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
import { ConfigurationModule } from './configuration/configuration.module';
import { ConfigurationService } from './configuration/configuration.service';
import { GatewayModule } from './gateway/gateway.module';
import { GroupsModule } from './groups/groups.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { SetupModule } from './setup/setup.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SummaryModule } from './summary/summary.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    ConfigurationModule.forRoot({
      conditionalModules: [
        {
          condition: 'GATEWAY_ENABLED',
          modules: [AssignmentsModule, GatewayModule]
        }
      ]
    }),
    CryptoModule.registerAsync({
      inject: [ConfigurationService],
      isGlobal: true,
      useFactory: (configurationService: ConfigurationService) => ({
        pbkdf2Params: {
          iterations: configurationService.get('DANGEROUSLY_DISABLE_PBKDF2_ITERATION') ? 1 : 100_000
        },
        secretKey: configurationService.get('SECRET_KEY')
      })
    }),
    GroupsModule,
    InstrumentsModule,
    PrismaModule.forRoot(),
    SubjectsModule,
    LoggingModule.forRoot({
      debug: true
    }),
    UsersModule,
    SetupModule,
    SummaryModule,
    SessionsModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory(configurationService: ConfigurationService) {
        // this cannot be used with conditional module easily, since APP_GUARD requires something
        return configurationService.get('THROTTLER_ENABLED')
          ? [
              {
                limit: 25,
                name: 'short',
                ttl: 1000
              },
              {
                limit: 100,
                name: 'medium',
                ttl: 10000
              },
              {
                limit: 250,
                name: 'long',
                ttl: 60000
              }
            ]
          : [];
      }
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard
    }
  ]
})
export class AppModule {}
