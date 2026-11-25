import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGameDto } from './dto/create-game.dto.js';
import { UpdateGameDto } from './dto/update-game.dto.js';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(genre?: string, search?: string) {
    const where: Prisma.GameWhereInput = {};
    if (genre) where.genre = { contains: genre, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.game.findMany({ where, orderBy: { id: 'asc' } });
  }

  async findOne(id: string) {
    const game = /^\d+$/.test(id)
      ? await this.prisma.game.findUnique({ where: { id: Number(id) } })
      : null;
    if (!game) {
      throw new NotFoundException(`Game dengan id ${id} tidak ditemukan`);
    }
    return game;
  }

  create(dto: CreateGameDto) {
    return this.prisma.game.create({ data: dto });
  }

  async update(id: string, dto: UpdateGameDto) {
    const game = await this.findOne(id);
    return this.prisma.game.update({ where: { id: game.id }, data: dto });
  }

  async remove(id: string) {
    const game = await this.findOne(id);
    await this.prisma.game.delete({ where: { id: game.id } });
    return { message: `Game "${game.title}" berhasil dihapus` };
  }

  // Opsional: query lanjutan (count, aggregate, groupBy)
  async statistik() {
    const [total, agg, perGenre, terbaik] = await Promise.all([
      this.prisma.game.count(),
      this.prisma.game.aggregate({ _avg: { rating: true, price: true } }),
      this.prisma.game.groupBy({
        by: ['genre'],
        _count: { _all: true },
        _avg: { rating: true },
        orderBy: { genre: 'asc' },
      }),
      this.prisma.game.findFirst({ orderBy: { rating: 'desc' } }),
    ]);
    return {
      totalGame: total,
      rataRataRating: agg._avg.rating,
      rataRataHarga: agg._avg.price,
      gameRatingTertinggi: terbaik?.title ?? null,
      perGenre: perGenre.map((g) => ({
        genre: g.genre,
        jumlah: g._count._all,
        rataRataRating: g._avg.rating,
      })),
    };
  }
}
