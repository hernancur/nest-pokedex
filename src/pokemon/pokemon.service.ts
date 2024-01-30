import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import mongoose, { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);
      return newPokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists in db - ${JSON.stringify(error.keyValue)}`,
        );
      }
      throw new InternalServerErrorException(
        `Can't create Pokemon ${createPokemonDto.name} - Check logs`,
      );
    }
  }

  async findAll() {
    try {
      const pokemons = await this.pokemonModel.find();
      if (!pokemons.length)
        throw new NotFoundException(`They're no Pokemons available`);
      return pokemons;
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: mongoose.Types.ObjectId) {
    try {
      const pokemon = await this.pokemonModel.findById(id);
      if (!pokemon)
        throw new NotFoundException(`Pokemon with id ${id} not found.`);
      return pokemon;
    } catch (error) {
      return error.message;
    }
    return `This action returns a #${id} pokemon`;
  }

  async update(
    id: mongoose.Types.ObjectId,
    updatePokemonDto: UpdatePokemonDto,
  ) {
    try {
      const updated = await this.pokemonModel.updateOne(
        { _id: id },
        { ...updatePokemonDto },
      );
      if (updated.modifiedCount < 1)
        throw new BadRequestException('Nothing to update. 0 rows affected');
      return 'Updated';
    } catch (error) {
      return error.message;
    }
  }

  async remove(id: mongoose.Types.ObjectId) {
    try {
      const deleted = await this.pokemonModel.deleteOne({ _id: id });
      if (deleted.deletedCount < 1)
        throw new BadRequestException('Nothing to delete. 0 rows affected.');
      return 'Deleted';
    } catch (error) {
      return error.message;
    }
  }
}
