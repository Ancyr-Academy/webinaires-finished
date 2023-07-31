import { ITestApp } from './test-app.interface';

export interface IFixture {
  save(app: ITestApp): Promise<void>;
}
