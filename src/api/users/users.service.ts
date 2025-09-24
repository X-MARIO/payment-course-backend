import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  public async findAll(): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      resolve([]);
    });
  }
}
