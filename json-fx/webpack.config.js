const path = require("path");

module.exports = {
  entry: {
    app: ["./dist/js/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist/webpack"),
    library: "jsonFx",
    libraryTarget: "umd",
    filename: "index.js",
    globalObject: "this"
  },
  mode: "production"
};
