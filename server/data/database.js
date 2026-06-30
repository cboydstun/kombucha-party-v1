import fs from "fs";

const DB_PATH = "db.json";

export const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

export const saveDb = () => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};
