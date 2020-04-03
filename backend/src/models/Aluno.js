const moongose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const uniqueValidator = require('mongoose-unique-validator');

const AlunoSchema = new moongose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AlunoSchema.plugin(mongoosePaginate);
AlunoSchema.plugin(uniqueValidator);

moongose.model("Aluno", AlunoSchema);
