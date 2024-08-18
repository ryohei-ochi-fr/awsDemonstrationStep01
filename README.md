# AWSの勉強会に向けたデモンストレーションアプリ

AWSの水平スケーリングを具体的に示すためのアプリケーション

## 開発環境環境構築

以下のコマンドをインストールする

- scoop
- hub
- gibo

参考サイト

[GitHub のコマンドラインツール「hub」の基本と便利な使い方のまとめ | DevelopersIO](https://dev.classmethod.jp/articles/hub/)  
[github/hub: A command-line tool that makes git easier to use with GitHub.](https://github.com/github/hub)  
[ScoopInstaller/Scoop: A command-line installer for Windows.](https://github.com/ScoopInstaller/Scoop)  

```powershell
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
scoop --version
scoop update
scoop install hub
hub --version
scoop install gibo
gibo version
```

PowerShellでhubをgitのエイリアスに設定するのが公式だけど、明確にhubコマンドを利用する方針とするー
ので、エイリアス設定はしない。

```powershell
Set-Alias git hub
```

## リポジトリ作成

作業フォルダを用意する(フォルダ名は任意、リポジトリ名になる)
個人開発と社用開発など切り替えるため、リポジトリ内(--local)でgithubのアカウントを設定する。

```powershell
mkdir awsDemonstrationStep01
cd awsDemonstrationStep01
git init

git config --local user.name ryohei-ochi-fr
git config user.name
git config --local user.email ryohei.ochi@futurerays.biz
git config user.email

gibo update
gibo dump Node VisualStudioCode > .gitignore

code .
```

github に、リポジトリ(remote)を作成する

```powershell
hub create
```

githubへの認証は、事前にgithubでアクセストークンを作成するか、クレデンシャルマネージャを利用する。

`github.com username` メアドじゃないユーザ名 ryohei-ochi-fr

`github.com password` アクセストークン

認証エラーとなる場合はhubの設定ファイルを確認する

```powershell
type ~/.config/hub
```

```ps
git remote -v
origin  https://github.com/ryohei-ochi-fr/awsDemonstrationStep01.git (fetch)
origin  https://github.com/ryohei-ochi-fr/awsDemonstrationStep01.git (push)
```

ブラウザでリモートリポジトリを確認する

```powershell
hub browse
```

## first commit

```powershell
git add .
git commit -m "first commit"
git status

git branch

git branch -m master
git push -u origin master
```

## npm

```ps
npm init
```

## gRPC

バックエンドでの長時間処理の経過をフロントへ渡すために使ってみる。

[gRPCをTypeScriptで使う（前編） #Node.js - Qiita](https://qiita.com/Aniokrait/items/d5cb4ebba5af2acee5e5)

[TypeScriptでgRPCを使ったアプリケーション開発をしてみた - 電通総研 テックブログ](https://tech.dentsusoken.com/entry/2022/09/26/TypeScript%E3%81%A7gRPC%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E9%96%8B%E7%99%BA%E3%82%92%E3%81%97%E3%81%A6%E3%81%BF%E3%81%9F)

- Server streaming

RPC クライアントから送られてきた一つのリクエストに対して、サーバは複数回に分けてレスポンスを返す通信方式です。

[Node.js + TypeScript で gRPCに入門する [後編: 実装編]](https://zenn.dev/hedrall/articles/grpc-implementation-20211221)

[TypeScriptでgRPCのstreaming RPCを使ったチャットのサンプル - daikiojm’s diary](https://daikiojm.hatenablog.com/entry/2018/12/24/002656)

[gRPCのServer-Streaming RPCを用いたPUSH通知の実現事例 | Fintan](https://fintan.jp/page/1521/)

[OK Google, Protocol Buffers から生成したコードを使って Node.js で gRPC 通信して | メルカリエンジニアリング](https://engineering.mercari.com/blog/entry/20201216-53796c2494/)

```ps
npm install @grpc/grpc-js google-protobuf @types/google-protobuf typescript ts-node
npm install --save-dev grpc-tools grpc_tools_node_protoc_ts 
npm run generate

```

## 起動方法

シンプルにサーバとクライアント間で通信

```ps

# server
npm run dev:server

# client
npm run dev:bff
```

ブラウザでアクセス

```ps
http://localhost:9000/hello-world
http://localhost:9000/hello-world?name=Mercari
```
