import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-interface-interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CommonService } from 'src/common/common.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly commonService: CommonService,
    private readonly http: AxiosAdapter,
  ) {}

  private async bulkCreate(pokemons) {
    const operations = pokemons.map((pokemon) => ({
      updateOne: {
        filter: { name: pokemon.name },
        update: pokemon,
        upsert: true,
      },
    }));
    try {
      await this.pokemonModel.bulkWrite(operations);
      return `Inserted ${pokemons.length} pokemons`;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async executeSeed() {
    try {
      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=800',
      );

      const pokemonsToInsert: { name: string; no: number }[] = data.results.map(
        ({ name, url }) => {
          const segments = url.split('/');
          const no: number = +segments[segments.length - 2];
          return { name, no };
        },
      );
      // private seed bulk create class method
      return await this.bulkCreate(pokemonsToInsert);
    } catch (error) {
      return error.message;
    }
  }

  async clearDatabase() {
    try {
      const result = await this.pokemonModel.deleteMany({});
      return `Deleted ${result.deletedCount} documents.`;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
