// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.38.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
    undici: true
    
  },
  package: {
    // package.json properties
    name: "clashapi",
    version: Deno.args[0],
    description: "API wrapper around the official clash royale api",
    license: "by-nc-sa 4.0",
    repository: {
      type: "git",
      url: "git+https://github.com/darkdarcool/clashapi.git",
    },
    bugs: {
      url: "https://github.com/darkdarcool/clashapi/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});