import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GamesModule } from './games/games.module.js';

@Module({
  imports: [PrismaModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
