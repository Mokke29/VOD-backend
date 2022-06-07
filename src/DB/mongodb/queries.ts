import { settingsModel } from './models/settingsModel';

async function findUserSettings(token: string) {
  const settings = await settingsModel.findOne({ user: token }).exec();
  return settings;
}

export { findUserSettings };
