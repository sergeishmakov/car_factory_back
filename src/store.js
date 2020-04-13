import fs from 'fs';

export function readStore(query) {
  const store = fs.readFileSync('store.json', 'utf8');
  if (query) return JSON.parse(store)[query];
}

export function writeStore(value) {
  const store = fs.readFileSync('store.json', 'utf8');
  fs.writeFile(
    'store.json',
    JSON.stringify({ ...JSON.parse(store), ...value }),
    function (error) {
      if (error) throw error;
      console.log('Запись файла завершена.', value);
    }
  );
}
