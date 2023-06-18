import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import moment from 'moment';

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            console.log(search)
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');

            const task = {
                id: randomUUID(),
                title, 
                description,
                completed_at: dateNow,
                created_at: dateNow,
                updated_at: dateNow
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    }
]