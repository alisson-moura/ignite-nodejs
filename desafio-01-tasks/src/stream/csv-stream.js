import fs from 'fs';
import { parse } from 'csv';

const csvFile = new URL('./tasks.csv', import.meta.url);
const url = 'http://localhost:3000/tasks';

(async () => {
  const parser = fs
    .createReadStream(csvFile)
    .pipe(parse({
      delimiter: ',',
      from_line: 2
    }))

  for await (const task of parser) {
    const [title, description] = task
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({title, description}),
      headers: { "Content-Type": "application/json" }
    })
  }
})();