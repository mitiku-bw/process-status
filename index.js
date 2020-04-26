const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)

let processes = [
  {
    id: 1,
    process_id: "fg232h3bjdwew",
    date: "2020-04-26T18:52:49.461Z",
    status: "WAITING"
  },
  {
    id: 2,
    process_id: "rtwryurerwe3453",
    date: "2020-04-26T18:53:49.461Z",
    status: "REJECTED"
  },
  {
    id: 3,
    process_id: "ewerrer78i8er",
    date: "2020-04-26T18:54:00.461Z",
    status: "CANCELLED"
  },
  {
    id: 4,
    process_id: "fsdfsfd676jgbew",
    date: "2020-04-26T18:55:14.461Z",
    status: "COMPLETED"
  },
]
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

/* 
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
}) 
*/

app.get('/api/processes', (req, res) => {
  res.json(processes)
})
const generateId = () => {
  const maxId = processes.length > 0
    ? Math.max(...processes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/processes', (request, response) => {
  const body = request.body

  if (!body.process_id || !body.status) {
    return response.status(400).json({
      error: 'process_id or process_status missing'
    })
  }

  const process = {
    process_id: body.process_id,
    status: body.status,
    date: new Date(),
    id: generateId(),
  }

  processes = processes.concat(process)

  response.json(process)
})

app.get('/api/process/:id', (request, response) => {
  const id = Number(request.params.id)
  const process = processes.find(process => process.id === id)
  if (process) {
    response.json(process)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/processes/:id', (request, response) => {
  const id = Number(request.params.id)
  processes = processes.filter(process => process.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})