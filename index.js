const express = require('express');

const server = express();
server.use(express.json());

// Query paramms = ?teste=1
// Route params = /users/1
// Request body = { "name": "douglas", "email": douglas@gmail.com}

let numeroRequest = 0;
const users = ['Douglas', 'Prince', 'Dodo']

// MIDDLEWARES GLOBAL
server.use((req, res, next) => {
  numeroRequest++;
  console.time('Request');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  console.log(`Numero de request: ${numeroRequest}`);

  next();

  console.timeEnd('Request');
});


// MIDDLEWARES LOCAL

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}


function checkUserArray(req, res, next) {
  const user = users[req.params.index]

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user
  return next();
}


// CRUD - Create, Read, Update, Delete
// Listar todos os usuarios
server.get('/users', (req, res) => {
  return res.json(users);
})

// Listar um usuario
server.get('/users/:index', checkUserArray, (req, res) => {
  // const { index } = req.params;
  // return res.json(users[index])

  return res.json(req.user)
})

// Criar Usuario
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users)
})


// Alterar usuario

server.put('/users/:index', checkUserExists, checkUserArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users)
})

// Excluir usuario

server.delete('/users/:index', checkUserArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send("usuario excluido com sucesso")
})



// DESAFIO 1

//let numeroRequest = 0;
const projects = [];


function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(x => x.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

// function logRequest(req, res, next) {
//   numeroRequest++;

//   console.log(`Numero de request: ${numeroRequest}`);

//   return next()
// }

// server.use(logRequest);


// Criar Projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects)
});


// Criar tarefa
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { titleTask } = req.body;

  const project = projects.find(x => x.id == id);

  project.tasks.push(titleTask);

  return res.json(project)
})


// Listar todos projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});


// Alterar Projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(x => x.id == id);

  project.title = title;
  return res.json(project);
});


// Deletar Projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(x => x.id == id);

  projects.splice(projectIndex, 1)

  return res.send("usuario excluido com sucesso")
});


server.listen(3000);