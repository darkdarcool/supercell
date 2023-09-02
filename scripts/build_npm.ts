// ex. scripts/build_npm.ts
import { build, emptyDir, } from "https://deno.land/x/dnt@0.38.0/mod.ts";

let didPost = false;

await emptyDir("./npm");
try {
await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
    undici: true
    
  },
  scriptModule: false,
  package: {
    // package.json properties
    name: "supercell.ts",
    version: Deno.args[0],
    description: "API wrapper around the official clash royale api",
    license: "by-nc-sa 4.0",
    repository: {
      type: "git",
      url: "git+https://github.com/darkdarcool/supercell.git",
    },
    bugs: {
      url: "https://github.com/darkdarcool/supercell/issues",
    },
    
  },
  postBuild() {
    didPost = true;
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
  typeCheck: false
});
} catch (e) {
  
}

if (!didPost) {
  Deno.copyFileSync("LICENSE", "npm/LICENSE");
  Deno.copyFileSync("README.md", "npm/README.md");
}