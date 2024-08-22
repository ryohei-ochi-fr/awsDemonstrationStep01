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

[Node.js Expressの例を通じて、Webアプリのセッションについて理解する #JavaScript - Qiita](https://qiita.com/yuta-katayama-23/items/4ea30b13e8002853402b)

http://ec2-44-242-222-52.us-west-2.compute.amazonaws.com:3000/index.html