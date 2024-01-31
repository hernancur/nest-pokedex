import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-interface-interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    try {
      const { data } = await this.axios.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=800',
      );

      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const pokeNumber: number = +segments[segments.length - 2];
        console.log(pokeNumber);
      });
      return data.results;
    } catch (error) {
      return error.message;
    }
  }
}
