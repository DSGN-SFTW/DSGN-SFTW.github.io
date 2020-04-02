const mongoose = require("mongoose");

const Professor = mongoose.model("Professor");

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;
    const professor = await Professor.paginate({}, { page, limit: 10 });

    return res.json(professor);
  },

  async show(req, res) {
    const professor = await Professor.findById(req.params.id);

    return res.json(professor);
  },

  async createProfessor(req, res) {
    const professor = await Professor.create(req.body);
    return res.json(professor);
  },

  async update(req, res) {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    return res.json({
      statusCode: 200,
      message: "Item atualizado com sucesso!",
      professor
    });
  },

  async destroy(req, res) {
    await Professor.findByIdAndRemove(req.params.id);

    return res.json("Item deletado com sucesso!");
  }
};
