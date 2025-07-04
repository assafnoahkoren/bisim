import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcModule } from './trpc/trpc.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TrpcModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
