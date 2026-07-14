// Runs before the test module graph loads. authController.js and
// authMiddleware.js read JWT_SECRET into a module-level const at import time,
// so it has to be in the environment by now. dotenv leaves already-set vars
// alone, so the real server/.env can't clobber these.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
