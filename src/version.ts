"use strict";

import fs from "fs";
import { IVersionData } from "./interfaces";

const project: IVersionData = JSON.parse(fs.readFileSync("package.json").toString());
const projectVersion: string = project.version;
const buildNumber: string = "xxx";

export = {
  build: buildNumber,
  version: projectVersion
};
