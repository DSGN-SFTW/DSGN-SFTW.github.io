const mongoose = require("mongoose");

const Aluno = mongoose.model("Aluno");

module.exports = {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const alunos = await Aluno.paginate({}, { page, limit: 10 });

      return res.json(alunos);
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
      const aluno = await Aluno.findById(req.params.id);

      return res.json({
        aluno,
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

  async createAluno(req, res) {
    try {
      const aluno = await Aluno.create(req.body);
      return res.json({
        message: "O item foi criado com sucesso",
        success: true,
        created_item: {
          aluno
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
      const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });

      return res.json({
        statusCode: 200,
        message: "Item atualizado com sucesso!",
        updated_info: {
          aluno
        }
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
      await Aluno.findByIdAndRemove(req.params.id);

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
