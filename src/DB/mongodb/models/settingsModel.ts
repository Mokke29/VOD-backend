import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  user: String,
  settings: Object,
});

const settingsModel = mongoose.model('settingsModel', settingsSchema);

export { settingsModel };
