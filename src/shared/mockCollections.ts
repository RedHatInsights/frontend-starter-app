export interface ResettableMockCollection<T> {
  items: T[];
  reset(): void;
  findAll(): T[];
  findById(id: string): T | undefined;
  create(item: T): T;
  update(id: string, updates: Partial<T>): T | undefined;
  delete(id: string): boolean;
}

export function createResettableCollection<T extends { id: string }>(
  initialItems: T[],
): ResettableMockCollection<T> {
  const snapshot = JSON.parse(JSON.stringify(initialItems)) as T[];
  let items = JSON.parse(JSON.stringify(initialItems)) as T[];

  return {
    get items() {
      return items;
    },
    reset() {
      items = JSON.parse(JSON.stringify(snapshot)) as T[];
    },
    findAll() {
      return [...items];
    },
    findById(id: string) {
      return items.find((item) => item.id === id);
    },
    create(item: T) {
      items.push(item);
      return item;
    },
    update(id: string, updates: Partial<T>) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      items[index] = { ...items[index], ...updates };
      return items[index];
    },
    delete(id: string) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      return true;
    },
  };
}
