function createAvatar() {
  const avatars = ['pug', 'panda', 'shiba', 'raccoon', 'koala'];
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  return avatar;
}

export { createAvatar };
