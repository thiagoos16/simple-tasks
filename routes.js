import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import moment from 'moment';

const database = new Database()
const dateNow = moment().format('YYYY-MM-DD HH:mm:ss')

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const search = req.query ? req.query : '';
           
            const tasks = database.select('tasks', search ? {
                title: search.title ? search.title : '',
                description: search.description ? search.description : ''
            } : null)

            if (!tasks) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    error: 'Register not found.',
                }));
            }

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            if (!req.body.title || !req.body.description) {
                return res.writeHead(400).end()
            }
            
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title, 
                description,
                completed_at: null,
                created_at: dateNow,
                updated_at: dateNow
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } =  req.params
            let dataToUpdate = {}
            const originalData = database.findOne('tasks', id)

            if (!originalData) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    error: 'Register not found.',
                }));
            }

            if (req.body.title && req.body.description) {
                return res.writeHead(400).end()
            }

            if (req.body.title) {
                dataToUpdate = {
                    ...dataToUpdate,
                    title: req.body.title,
                    description: originalData.description
                }
            } else {
                dataToUpdate = {
                    ...dataToUpdate,
                    title: originalData.title,
                    description: req.body.description
                }
            }

            dataToUpdate = {
                ...dataToUpdate,
                completed_at: originalData.completed_at,
                created_at: originalData.created_at,
                updated_at: dateNow
            }

            database.update('tasks', id, dataToUpdate)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const originalData = database.findOne('tasks', id)

            if (!originalData) {
                return res.writeHead(404).end()
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } =  req.params
            let dataToUpdate = {}
            const originalData = database.findOne('tasks', id)

            if (!originalData) {
                return res.writeHead(404).end()
            }

            if (originalData.completed_at === null) {
                dataToUpdate = {
                    ...dataToUpdate,
                    completed_at: dateNow
                }
            } else {
                dataToUpdate = {
                    ...dataToUpdate,
                    completed_at: null
                }
            }

            dataToUpdate = {
                ...dataToUpdate,
                title: originalData.title,
                description: originalData.description,
                created_at: originalData.created_at,
                updated_at: dateNow
            }

            database.update('tasks', id, dataToUpdate)

            return res.writeHead(204).end()
        }
    },
]