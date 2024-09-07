export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  update(id: number, data: Partial<T>): Promise<T>;
  create(data: any): Promise<T>;
  delete(id: number): Promise<T>;
}
