import express from "express";
import rateLimit from "express-rate-limit";
import os from "os";
import path from "path";
import ejs from "ejs";
import fs from "fs";

import expressSession from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";

// [fingerprintjs/docs/typescript_support.md at master · fingerprintjs/fingerprintjs](https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/typescript_support.md)
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// インメモリーデータベース接続
const dbPromise = open({
  filename: ":memory:",
  driver: sqlite3.Database,
});

const app: express.Express = express();
const port = 3000;

/*
// Rate Limitの設定
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10分

  limit: 10, // 10分間に100リクエストまで許可

  standardHeaders: true, // Rate Limitヘッダーに関する情報を返す
  legacyHeaders: false, // 無効化されたRate Limitヘッダーを削除する
  handler: (req, res) => {
    res
      .set({
        "Retry-After": 3600, // 秒単位でクライアントに再試行を伝える
        // "X-RateLimit-Reset": "時間のタイムスタンプ", // Rate Limitがリセットされる予定時刻
      })
      //   .status(429)
      .redirect("/rate-limit-page.html");
    //   .json({
    //     message: "Too many requests. Please try again later.",
    //   });
  },
});

// Rate Limitを適用
app.use("/index.html", apiLimiter);

*/

// Expressアプリケーションの設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// JSONパース用のミドルウェア
app.use(express.json());

// clientディレクトリを静的ファイルのルートとして設定
app.use(express.static("src/client/"));
app.get("/", (req, res) => {
  res.redirect(302, "/index.html");
});

let globalVisitorId = "";
let progressVisitorId = "";

// ルートハンドラー
app.get("/index.html", async (req, res) => {
  const db = await dbPromise;
  await db.exec("create table if not exists VisitorId(id text)");
  console.log('create table');
  await db.exec("delete from VisitorId;");
  // await db.exec("truncate table VisitorId;");
  //await db.exec("INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com'), ('Jane Doe', 'jane@example.com')");
  const id = await db.all("SELECT * FROM VisitorId");
  //res.json({ users });
  console.log(id);

  if (progressVisitorId == "") {
    const serverHostname = os.hostname();
    res.render("index", { serverHostname }); // index.ejsテンプレートに変数を渡す
    console.log(globalVisitorId);
  } else {
    res.redirect(302, "/rate-limit-page.html");
  }
});

app.get("/drop.html", async (req, res) => {
  const db = await dbPromise;
  await db.exec("drop table VisitorId");
  res.write('drop tablr');
  console.log('drop tablr');
});

// ハンドラー
app.get("/progress.html", async (req, res) => {
  console.log(`enter progress`);
  console.log(`identify globalVisitorId: ${globalVisitorId}`);
  console.log(`identify progressVisitorId: ${progressVisitorId}`);

  const db = await dbPromise;
  const ids = await db.all('SELECT id FROM VisitorId');

  if (ids.length == 0 ) {
    //await db.exec('create table if not exists VisitorId(id text)');
    await db.exec(`INSERT INTO VisitorId (id) VALUES ('${progressVisitorId}')`);
    res.render("progress");
  } else {
    res.redirect(302, "/rate-limit-page.html");
  }
});

// ハンドラー
app.get("/rate-limit-page.html", (req, res) => {
  console.log(`identify globalVisitorId: ${globalVisitorId}`);
  console.log(`identify progressVisitorId: ${progressVisitorId}`);
});

// fingerprintjsのエンドポイント
app.post("/identify", (req, res) => {
  const { visitorId } = req.body;
  globalVisitorId = visitorId;
  console.log(`identify Visitor ID: ${visitorId}`);
  console.log(`identify globalVisitorId: ${globalVisitorId}`);
  console.log(`identify progressVisitorId: ${progressVisitorId}`);
  progressVisitorId;
  res.json({ visitorId }); // ビジターIDをJSON形式で返す
});

// SSEエンドポイント
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  progressVisitorId = globalVisitorId;
  // 1秒ごとにメッセージを送信
  setInterval(() => {
    const data = JSON.stringify({
      time: new Date().toISOString(),
      message: "処理中",
    });
    res.write(`data: ${data}\n\n`);
  }, 1000);
});

//app.use("test1", require("src/client/test1.ts"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
