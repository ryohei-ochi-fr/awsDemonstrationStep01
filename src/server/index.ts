import express from "express";
import rateLimit from "express-rate-limit";
import os from "os";
import path from "path";
import ejs from "ejs";

import expressSession from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import session from "express-session";

const app: express.Express = express();
const port = 3000;

// clientディレクトリを静的ファイルのルートとして設定
app.use(express.static("src/client/"));

// Rate Limitの設定
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10分

  limit: 1, // 10分間に100リクエストまで許可

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

// Expressアプリケーションの設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ルートハンドラー
app.get("/index.html", (req, res) => {
  const serverHostname = os.hostname();
  res.render("index", { serverHostname }); // index.ejsテンプレートに変数を渡す
});

// SSEエンドポイント
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

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
