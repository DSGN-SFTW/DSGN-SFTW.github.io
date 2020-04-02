const mongoose = require("mongoose");

const Aluno = mongoose.model("Aluno");

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;
    const alunos = await Aluno.paginate({}, { page, limit: 10 });

    return res.json(alunos);
  },

  async show(req, res) {
    const aluno = await Aluno.findById(req.params.id);

    return res.json(aluno);
  },

  async createAluno(req, res) {
    const aluno = await Aluno.create(req.body);
    return res.json(aluno);
  },

  async update(req, res) {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    return res.json(aluno);
  },

  async destroy(req, res) {
    await Aluno.findByIdAndRemove(req.params.id);

    return res.json("Item deletado com sucesso!");
  }
};
