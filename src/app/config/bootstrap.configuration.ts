export const bootstrapConfig = () => {
  if (!process.env.MASTER_ADMIN_EMAIL) {
    throw new Error('MASTER_ADMIN_EMAIL is not defined');
  }
  if (!process.env.MASTER_ADMIN_PASSWORD) {
    throw new Error('MASTER_ADMIN_PASSWORD is not defined');
  }
  return {
    bootstrapConfig: {
      masterAdmin: {
        email: process.env.MASTER_ADMIN_EMAIL,
        password: process.env.MASTER_ADMIN_PASSWORD,
      },
    },
  };
};
