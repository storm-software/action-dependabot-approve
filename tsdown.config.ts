/* -------------------------------------------------------------------

    🗲 Storm Software - Action Dependabot Approve

 This code was released as part of the Action Dependabot Approve project. Action Dependabot Approve
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/action-dependabot-approve.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/action-dependabot-approve
 Documentation:            https://docs.stormsoftware.com
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  target: "esnext",
  outDir: "dist",
  format: "esm",
  cjsDefault: true,
  treeshake: true,
  exports: true,
  clean: true,
  sourcemap: false,
  platform: "node",
  tsconfig: "./tsconfig.json",
  minify: true,
  dts: true,
  shims: true,
  fixedExtension: false,
  nodeProtocol: true,
  unbundle: false,
  deps: {
    skipNodeModulesBundle: false
  }
});
