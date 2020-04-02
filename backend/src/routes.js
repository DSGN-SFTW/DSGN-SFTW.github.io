const express = require("express");
const routes = express.Router();

const AlunoController = require("./controllers/AlunoController");
const ProfessorController = require("./controllers/ProfessorController");

//Rotas relaciondas aos alunos
routes.get("/alunos", AlunoController.index);
routes.get("/alunos/:id", AlunoController.show);
routes.post("/criar-aluno", AlunoController.createAluno);
routes.put("/alunos/:id", AlunoController.update);
routes.delete("/alunos/:id", AlunoController.destroy);

//Rotas relaciondas aos professores
routes.get("/professores", ProfessorController.index);
routes.get("/professores/:id", ProfessorController.show);
routes.post("/criar-professor", ProfessorController.createProfessor);
routes.put("/professores/:id", ProfessorController.update);
routes.delete("/professores/:id", ProfessorController.destroy);

module.exports = routes;
