const moongose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

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
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProfessorSchema.plugin(mongoosePaginate);
moongose.model("Professor", ProfessorSchema);
