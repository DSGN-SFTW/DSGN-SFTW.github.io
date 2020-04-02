const moongose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const AlunoSchema = new moongose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AlunoSchema.plugin(mongoosePaginate);

moongose.model("Aluno", AlunoSchema);
