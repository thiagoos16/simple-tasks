import fs from 'node:fs/promises'

const databasePath = new URL('./db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
       let data = this.#database[table] ?? []

       if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    value = decodeURIComponent(value.replace(/%20/g, ' '))
                    
                    if (value)
                        return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
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

    update(table, id, data) {
        const rowIndex =  this.#database[table].findIndex(row => row.id === id)
       
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data }
            this.#persist()
        }
    }

    delete(table, id) {
        return true
    }

    originalData(table, id) {
       return this.#database[table].find(row => row.id === id)
    }

    completeTask() {
        return true
    }
} 