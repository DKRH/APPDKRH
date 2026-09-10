import path from "node:path";


const isDevelopment = process.env.APP_ENV === "development";

const isCompiled =
    process.execPath !== "bun" &&
    !process.execPath.endsWith("bun.exe");

export const appDir = isCompiled
    ? path.dirname(process.execPath)
    : process.cwd();
    /*
const baseDir = isDevelopment
    ? resolve(process.cwd()) // monorepo root
    : resolve(dirname(process.execPath), "../html");*/
    
const IP_FILE = path.join(appDir, "ip.txt");