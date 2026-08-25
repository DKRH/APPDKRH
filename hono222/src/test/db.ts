import { db } from "@/db";
import { b_passbank } from "@/db/schema";

const websites = [
  "Google",
  "Facebook",
  "GitHub",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Discord",
  "Steam",
  "Spotify",
  "Dropbox",
];

const rows = Array.from({ length: 200 }, (_, i) => ({
  title: websites[i % websites.length],
  username: `employee${String(i + 1).padStart(3, "0")}`,
  password: `Pass${Math.random().toString(36).slice(2, 10)}`,
  note: `Sample credential #${i + 1}`,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "admin",
  updatedBy: "admin",
}));

async function seed() {
  await db.insert(b_passbank).values(rows);

  console.log(`Inserted ${rows.length} rows`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });