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

  select(table, search) {
    let data = this.#database[table] ?? []
    if (search) {
      data = data.filter(row => (Object.entries(search).some(([key, value]) => row[key].includes(value))))
    }

    return data
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

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(item => item.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, data) {
    const rowIndex = this.#database[table].findIndex(item => item.id === data.id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = data
      this.#persist()
    }
  }
}