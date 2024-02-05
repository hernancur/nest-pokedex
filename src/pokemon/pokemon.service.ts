import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly commonService: CommonService,
  ) {}

  private readonly axios: AxiosInstance = axios;

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const existingPokemon = await this.pokemonModel.findOne({
        $or: [{ name: createPokemonDto.name }, { no: createPokemonDto.no }],
      });
      if (existingPokemon)
        throw new BadRequestException(
          'Pokemon already exists or has duplicated key value',
        );
      const newPokemon = await this.pokemonModel.create(createPokemonDto);
      return newPokemon;
    } catch (error) {
      this.commonService.handleExceptions(error);
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

  async findOne(term: string) {
    try {
      let pokemon: Pokemon;
      // Es un numero
      if (!isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: term });
      }

      // Es mongo id
      if (!pokemon && isValidObjectId(term)) {
        pokemon = await this.pokemonModel.findById(term);
      }

      // Es un nombre
      if (!pokemon) {
        term = term.toLowerCase().trim();
        pokemon = await this.pokemonModel.findOne({
          name: term,
        });
      }

      if (!pokemon) {
        const searchPoke = await this.seedOne(term);
        if (!searchPoke)
          throw new NotFoundException(`Pokemon with term ${term} not found.`);
        return searchPoke;
      }
      return pokemon;
    } catch (error) {
      return error.message;
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.findOne(term);
      await pokemon.updateOne(updatePokemonDto, {
        new: true,
      });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: mongoose.Types.ObjectId) {
    try {
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
      if (deletedCount < 1)
        throw new BadRequestException(
          `0 rows affected. ID [${id}] not found in db `,
        );
      return 'Deleted';
    } catch (error) {
      return error.message;
    }
  }

  async seedOne(pokemon) {
    try {
      // No existe en DB, lo buscamos en API y lo cargamos
      const { data } = await this.axios(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
      );
      const pokeToCreate = { name: data.name, no: data.id };
      const created = await this.create(pokeToCreate);
      return created;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
