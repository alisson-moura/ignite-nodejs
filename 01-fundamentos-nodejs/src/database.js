import fs from 'node:fs/promises'

export class Database {
  #database = {}
  #dbUrl = new URL('../db.json', import.meta.url)

  constructor() {
    fs.readFile(this.#dbUrl, 'utf8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }
  
 #persist() {
    fs.writeFile(this.#dbUrl, JSON.stringify(this.#database))
 }

  select(table) {
    return this.#database[table] ?? []
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }
}