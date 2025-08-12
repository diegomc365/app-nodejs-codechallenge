import { DecideStatusUseCase } from '../../../src/application/usecases/decide-status.usecase';

describe('DecideStatusUseCase', () => {
  let uc: DecideStatusUseCase;

  beforeEach(() => {
    uc = new DecideStatusUseCase();
  });

  it('aprueba cuando value <= 1000', () => {
    expect(uc.execute(1000)).toBe('approved');
    expect(uc.execute(120)).toBe('approved');
  });

  it('rechaza cuando value > 1000', () => {
    expect(uc.execute(1001)).toBe('rejected');
    expect(uc.execute(1500)).toBe('rejected');
  });
});