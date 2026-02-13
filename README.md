# tetris-trainer-neo

`https://teatube.cn/ttt/ttt/` をベースにしたフロントエンド再現プロジェクトです。

## 技術スタック

- Vue 3 + Vite (JavaScript)
- Vitest
- Storybook (play 関数によるストーリーテスト)

## 開発

```bash
npm install
npm run dev
```

## テスト

```bash
npm run test
npm run test:unit
npm run test:storybook
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

## 主要構成

- `public/legacy/`: 元サイトの資産 (HTML/CSS/JS/画像)
- `src/components/LegacyTrainer.vue`: 埋め込み表示 + ゲームパッド入力ブリッジ
- `src/components/LegacyTrainer.stories.js`: Storybookストーリー（play付き）
- `src/components/LegacyTrainer.test.js`: Vitestユニットテスト
