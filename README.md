# Time Tools

時間範囲の計算と時間単位の変換ができる、シンプルなWebアプリです。
HTML・CSS・JavaScriptのみで構成されているため、GitHub Pagesでそのまま公開できます。

## 機能

### 時間範囲

- 開始時刻と終了時刻から経過時間を計算
- 終了時刻が開始時刻より前の場合は翌日として計算
- 任意の時間を分単位で差し引き
- 結果を「時間・分」「合計分」「小数時間」で表示

### 時間変換

- `hh:mm` から分へ変換
- 分から `hh:mm` へ変換
- どちらの入力欄からでも相互に変換

## 使い方

`index.html` をブラウザで開いてください。ビルドや依存パッケージのインストールは不要です。

## ファイル構成

```text
.
├── index.html   # 画面構造
├── styles.css   # スタイル
├── script.js    # 計算処理
└── README.md
```

## GitHub Pagesで公開する

1. このプロジェクトをGitHubリポジトリへプッシュします。
2. リポジトリの **Settings** → **Pages** を開きます。
3. **Build and deployment** のSourceで **Deploy from a branch** を選択します。
4. 公開するブランチと `/ (root)` を選択して保存します。

デプロイが完了すると、Pages画面に公開URLが表示されます。
