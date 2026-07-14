// Jest-only transform layer. Vite handles JSX for dev/build on its own; this
// exists so babel-jest can compile the same source for the test runner.
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
