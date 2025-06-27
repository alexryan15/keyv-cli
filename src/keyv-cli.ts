#!/usr/bin/env node
import { Command } from 'commander';
import { setValue, getValue, deleteKey, listStore, clearStore, updateValue, renameKey } from './store';
import { get } from 'http';

const program = new Command();
program
  .name('keyv')
  .description('A simple CLI-based key-value store')

program
  .command('set')
  .description('Set a key-value pair')
  .argument('<key>', 'Key')
  .argument('<value>', 'Value')
  .action((key, value) => {
    setValue(key, value);
    console.log(`Set ${key} : ${value}`);
  });

program
  .command('get')
  .description('Get a value by key')
  .argument('<key>', 'Key')
  .action((key) => {
    const value = getValue(key);
    if (value) {
      console.log(`${key} : ${value}`);
    } else {
      console.log(`${key} not found`);
    }
  });

program
  .command('update')
  .description('Update the value of an existing key')
  .argument('<key>', 'Key to update')
  .argument('<value>', 'New value')
  .action((key, value) => {
    const updated = updateValue(key, value);
    if (updated) {
      console.log(`Updated ${key} to ${value}`);
    } else {
      console.log(`"${key}" not found`);
    }
  });

program
  .command('delete')
  .description('Delete a key-value pair')
  .argument('<key>', 'Key')
  .action((key) => {
    const result = deleteKey(key);
    console.log(result ? `${key} deleted.` : `${key} not found`);
  });

program
  .command('rename')
  .description('Rename a key')
  .argument('<oldKey>', 'Current key name')
  .argument('<newKey>', 'New key name')
  .action((oldKey, newKey) => {
    const success = renameKey(oldKey, newKey);
    if (success) {
      console.log(`Renamed ${oldKey} to ${newKey}`);
    } else {
      if (!getValue(oldKey)) {
        console.log(`${oldKey} does not exist`)
      }
      else {
        console.log(`${newKey} already exists.`);
      }
    }
  });

program
  .command('ls')
  .description('List all stored pairs')
  .action(() => {
    const store = listStore();
    console.log(JSON.stringify(store, null, 2));
  });

program
  .command('exists')
  .description('Check if a key exists')
  .argument('<key>', 'Key to check')
  .action((key) => {
    const value = getValue(key);
    if (value !== undefined) {
      console.log(`"${key}" exists`);
      process.exit(0);
    } else {
      console.log(`"${key}" not found`);
      process.exit(1);
    }
  });

program
  .command('clear')
  .description('Clears storage')
  .action(() => {
    clearStore();
    console.log('Store cleared');
  });

program.parse();
