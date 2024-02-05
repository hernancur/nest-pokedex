import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';

@Module({
  imports: [
    PokemonModule,
    CommonModule,
    // MongooseModule.forFeature([
    //   {
    //     name: Pokemon.name,
    //     schema: PokemonSchema,
    //   },
    // ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
