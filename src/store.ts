import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

let STORE_FILE = join(__dirname, '..', 'store.json');

export function setStoreFilePath(filePath: string) {
  STORE_FILE = filePath;
}

function loadStore(): Record<string, string> {
  if (!existsSync(STORE_FILE)) return {};
  return JSON.parse(readFileSync(STORE_FILE, 'utf-8'));
}

function saveStore(store: Record<string, string>) {
  writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

export function setValue(key: string, value: string) {
  const store = loadStore();
  store[key] = value;
  saveStore(store);
}

export function getValue(key: string): string | undefined {
  const store = loadStore();
  return store[key];
}

export function updateValue(key: string, value: string): boolean {
  const store = loadStore();
  if (!(key in store)) {
    return false;
  }
  store[key] = value;
  saveStore(store);
  return true;
}

export function deleteKey(key: string): boolean {
  const store = loadStore();
  if (!(key in store)) return false;
  delete store[key];
  saveStore(store);
  return true;
}

export function renameKey(oldKey: string, newKey: string): boolean {
  const store = loadStore();
  if (!(oldKey in store)) return false;
  if (newKey in store) return false;

  store[newKey] = store[oldKey];
  delete store[oldKey];
  saveStore(store);
  return true;
}

export function listStore(): Record<string, string> {
  return loadStore();
}

export function clearStore() {
  saveStore({});
}
