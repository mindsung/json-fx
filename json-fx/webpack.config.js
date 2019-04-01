const path = require("path");

module.exports = {
  entry: {
    app: ["./dist/full/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist/webpack"),
    library: "jsonFx",
    libraryTarget: "umd",
    filename: "json-fx.js",
    globalObject: "this"
  },
  mode: "production"
};
