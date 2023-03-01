const fs = require("fs");
require("dotenv").config();

async function importSqlTables(file) {
  const db = await require("./functions/dataBase/createConnection").open({ dontNeedToUse: true });
  const executeQuery = require("./functions/dataBase/executeQuery").run;
  const dbName = process.env.DB_DATABASE;
  await executeQuery(db, "CREATE DATABASE IF NOT EXISTS ??", [dbName]);
  await executeQuery(db, "USE ??", [dbName]);
  await new Promise((resolve) => {
    fs.readFile(file, "utf8", async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const lineData = data.split("\n");
      for (const line of lineData) {
        if ((line !== "\r" || line !== "") && !line.startsWith("--")) {
          const res = await executeQuery(db, line, []);
          if (res[0] && res[0].code !== "ER_DUP_ENTRY" && res[0].sql.length > 5) console.log(res[0]);
        }
      }

      await require("./functions/dataBase/createConnection").close(db);
      resolve();
    });
  });
}

async function start() {
  await importSqlTables("./dataBase.sql");
  console.log("The database is ready");
}

start();
