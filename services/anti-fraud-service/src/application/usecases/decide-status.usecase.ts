import { Injectable } from '@nestjs/common';

@Injectable()
export class DecideStatusUseCase {
  execute(value: number): 'approved' | 'rejected' {
    return value > 1000 ? 'rejected' : 'approved';
  }
}
