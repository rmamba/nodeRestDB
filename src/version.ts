import * as fs from "fs";
import { IVersionData } from "./interfaces";

const project: IVersionData = JSON.parse(fs.readFileSync('package.json').toString());
const __version__: string = project.version;
const __build_number__: string = 'xxx';

export = {
    version: __version__,
    build: __build_number__
};
