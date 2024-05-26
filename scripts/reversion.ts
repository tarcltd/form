import jsr from "../jsr.json"
import pkg from "../package.json"
import fs from "node:fs"
import path from "node:path"
import url from "node:url"

const workspaceDir = path.dirname(path.join(url.fileURLToPath(import.meta.url), ".."))

jsr.version = pkg.version

fs.writeFileSync(path.join(workspaceDir, "jsr.json"), JSON.stringify(jsr, null, 2))