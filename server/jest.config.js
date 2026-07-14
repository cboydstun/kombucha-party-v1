export default {
  testEnvironment: "node",
  // Native ESM — no Babel. Keeps import.meta.url working in app.js and
  // adminController.js. Run via NODE_OPTIONS=--experimental-vm-modules.
  transform: {},
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testTimeout: 20000, // mongodb-memory-server downloads mongod on first use
};
