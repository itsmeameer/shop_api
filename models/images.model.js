const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
  url: {
    type: String
  },
  size: {
    type: Number
  },
  public_id: {
    type: String
  },
  type: {
    type: String,
  },
}, {timestamps: true});

module.exports = mongoose.models.images || mongoose.model("images", imagesSchema);