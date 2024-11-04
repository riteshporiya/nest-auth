export const convertExpireInToMilliSeconds = (expireIn: string): number => {
  const regex = /(\d+)([smhd])/;
  const match = regex.exec(expireIn);
  if (match) {
    const [, value, unit] = match;
    const accessTokenExpireIn = Number(value);
    switch (unit) {
      case 's':
        return accessTokenExpireIn * 1000;
      case 'm':
        return accessTokenExpireIn * 1000 * 60;
      case 'h':
        return accessTokenExpireIn * 1000 * 60 * 60;
      case 'd':
        return accessTokenExpireIn * 1000 * 60 * 60 * 24;
      default:
        throw new Error('Invalid value');
    }
  } else {
    throw new Error('Invalid value');
  }
};
