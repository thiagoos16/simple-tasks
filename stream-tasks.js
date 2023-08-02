import { parse } from 'csv-parse'
import fs from 'node:fs'

const tasksCsvPath = new URL('./tasks.csv', import.meta.url)
const url = 'http://localhost:3333/tasks'
const customHeads = {
    "Content-Type": "application/json"
}


fs.createReadStream(tasksCsvPath)
    .pipe(
        parse({
            delimiter: ",",
            from_line: 2,
            columns: ['title', 'description']
        })
    )
    .on(
        "data", function (row) {
            const { title, description } = row
            
            const data = {
                title, 
                description
            }

            fetch(url, {
                method: "POST",
                headers: customHeads,
                body: JSON.stringify(data)
            }).then(response => {
                return response.text()
            }).then(data => {
                console.log(data)
            })
        }
    )
    .on(
        "end", function () {
            // console.log("finished")
        }
    ).on(
        "error", function (error) {
            console.log(error.message)
        }
    )