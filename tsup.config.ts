import { Options } from "tsup";

export const tsup: Options = {
  target: "esnext",
  clean: true,
  dts: false,
  entry: ["src"],
  keepNames: true,
  minify: true,
  sourcemap: true,
  format: ["esm"],
};
