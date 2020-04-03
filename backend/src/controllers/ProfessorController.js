const mongoose = require("mongoose");

const Professor = mongoose.model("Professor");

module.exports = {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const professor = await Professor.paginate({}, { page, limit: 10 });
      return res.json(professor);
    } catch (err) {
      console.log("Error: ", err);

      return res.json({
        errror: err,
        success: false
      });
    }
  },

  async show(req, res) {
    try {
      const professor = await Professor.findById(req.params.id);

      return res.json({
        professor,
        success: true
      });
    } catch (err) {
      console.log("Error: ", err);
      if (err.name === "CastError") {
        return res.json({
          message: "O aluno nao foi encontrado",
          success: false
        });
      }

      return res.json({
        errror: err,
        success: false
      });
    }
  },

  async createProfessor(req, res) {
    try {
      const professor = await Professor.create(req.body);
      return res.json({
        statusCode: 200,
        message: "O item foi criado com sucesso",
        success: true,
        created_item: {
          professor
        }
      });
    } catch (err) {
      console.log("Error name: ", err.name);
      if (err.name === "ValidatorError") {
        return res.json({
          message: "O email ja existe no sistema",
          success: false
        });
      }
      return res.json({
        error: err,
        success: false
      });
    }
  },

  async update(req, res) {
    try {
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
    } catch (err) {
      console.log("Error: ", err);
      if (err.name === "CastError") {
        return res.json({
          message: "O aluno nao foi encontrado",
          success: false
        });
      }

      return res.json({
        errror: err,
        success: false
      });
    }
  },

  async destroy(req, res) {
    try {
      await Professor.findByIdAndRemove(req.params.id);

      return res.json({
        message: "O item foi deletado com sucesso.",
        success: true
      });
    } catch (err) {
      console.log("Error: ", err.name);
      if (err.name === "CastError") {
        return res.json({
          message: "O id nao pode ser encontrado",
          success: false
        });
      }

      return res.json({
        errror: err,
        success: false
      });
    }
  }
};
