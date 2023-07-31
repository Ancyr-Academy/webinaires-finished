export interface ITestApp {
  get<T>(token: string | symbol | any): T;
}
