const moongose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const uniqueValidator = require("mongoose-unique-validator");

const ProfessorSchema = new moongose.Schema({
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
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProfessorSchema.plugin(mongoosePaginate);
ProfessorSchema.plugin(uniqueValidator);

moongose.model("Professor", ProfessorSchema);
