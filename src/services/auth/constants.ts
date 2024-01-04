export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
  expires_in: process.env.JWT_EXPIRES_IN || '5m',
};
