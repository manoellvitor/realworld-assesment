export interface ScenarioContext {
  setValue(key: string, value: any): void;
  getValue(key: string): any;
}

export class CustomContext implements ScenarioContext {
  private dataStore: Map<string, any>;

  constructor() {
    this.dataStore = new Map();
  }

  setValue(key: string, value: any, update: boolean = false): void {
    const existingValue = this.dataStore.get(key.toLowerCase());
    if (existingValue && !update) {
      throw new Error(
        `Key "${key}" already exists. Use update option to overwrite.`
      );
    }
    this.dataStore.set(key.toLowerCase(), value);
  }

  getValue(key: string): any {
    const value = this.dataStore.get(key.toLowerCase());
    if (value === undefined) {
      throw new Error(`Key "${key}" not found in the data store.`);
    }
    return value;
  }

  clear() {
    this.dataStore.clear();
  }
}
