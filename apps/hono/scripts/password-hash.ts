// this are manually hash using newer Bun argon2 to replace prev better-auth internal hash
import { $ } from "bun";

const password = "dewangga";

const hash = await Bun.password.hash(password, {
  algorithm: "argon2id",
  memoryCost: 65536,
  timeCost: 3,
});

console.log(hash);