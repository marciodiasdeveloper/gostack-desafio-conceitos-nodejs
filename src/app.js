const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const verifyIfIdExist = require('./middleware/verifyIfIdExist');


const app = express();

app.use(express.json());
app.use(cors());

function isValidUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'id is not a valid uuid'})
  }

  return next();
}

const repositories = [];

app.use("/repositories/:id", isValidUuid);

app.get("/repositories", (request, response) => {
 return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0,
   };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", verifyIfIdExist(repositories), (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
    
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes:0
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);  
});

app.delete("/repositories/:id", verifyIfIdExist(repositories), (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyIfIdExist(repositories), (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
