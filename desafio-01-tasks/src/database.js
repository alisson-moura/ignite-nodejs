import { Task } from "./Task.js"

export class Database {
  #database = {}

  insert(table, data) {
    if (this.#database[table] == undefined) {
      this.#database[table] = []
    }
    this.#database[table].push(data)
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(item => item.id === id)
    if (rowIndex > -1) {
      const keys = Object.keys(data)
      keys.forEach(key => this.#database[table][rowIndex][key] = data[key])
      return new Task(this.#database[table][rowIndex])
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(item => item.id === id)
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
    }
  }

  select(table, query) {
    let data = this.#database[table] ? this.#database[table] : []

    if (Object.keys(query).length > 0) {
      const keys = Object.keys(query)
      data = data.filter(item => keys.some(key =>
        item[key].includes(query[key])))
    }

    return data
  }
}