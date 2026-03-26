import { PostMetric, ScheduledPost, GeneratedPost, PostIdea, Persona } from "@/types";

export const dummyMetrics: PostMetric[] = [
  {
    id: "1",
    postId: "p1",
    content: "Claude Codeで1時間でWebアプリ作れた話。正直、設計を言語化して渡すだけでここまで動くとは思わなかった。",
    impressions: 45200,
    likes: 892,
    retweets: 234,
    theme: "AI開発",
    tone: "体験談",
    postedAt: "2026-03-25T10:00:00Z",
    hookStrength: 9,
    empathy: 8,
    shareability: 7,
    selfScore: 9,
  },
  {
    id: "2",
    postId: "p2",
    content: "プログラミング初心者が最初に学ぶべきは、コードじゃなくて「何を作りたいか言語化する力」だと思う。",
    impressions: 32100,
    likes: 567,
    retweets: 189,
    theme: "プログラミング学習",
    tone: "問題提起",
    postedAt: "2026-03-24T09:00:00Z",
    hookStrength: 8,
    empathy: 9,
    shareability: 8,
    selfScore: 8,
  },
  {
    id: "3",
    postId: "p3",
    content: "副業で月5万稼ぐのに必要なのは、スキルじゃなくて「誰の何を解決するか」を決めること。",
    impressions: 28900,
    likes: 445,
    retweets: 156,
    theme: "副業",
    tone: "結論先出し",
    postedAt: "2026-03-23T12:00:00Z",
    hookStrength: 7,
    empathy: 8,
    shareability: 7,
    selfScore: 7,
  },
];

export const dummyScheduled: ScheduledPost[] = [
  {
    id: "s1",
    content: "AIツールを使いこなす人と使いこなせない人の差は「指示の具体性」だけ。",
    scheduledAt: "2026-03-27T08:00:00Z",
    status: "scheduled",
    createdAt: "2026-03-26T10:00:00Z",
  },
  {
    id: "s2",
    content: "Webアプリ開発で一番大事なのは、最初にダミーデータでUIを完成させること。",
    scheduledAt: "2026-03-27T12:00:00Z",
    status: "scheduled",
    createdAt: "2026-03-26T11:00:00Z",
  },
  {
    id: "s3",
    content: "来週公開予定の新機能について。",
    scheduledAt: "2026-03-28T09:00:00Z",
    status: "draft",
    createdAt: "2026-03-26T12:00:00Z",
  },
];

export const dummyGenerated: GeneratedPost[] = [
  {
    id: "g1",
    title: "AI開発の本質",
    hook: "Claude Codeに丸投げして失敗した話をします。",
    body: "最初は「全部作って」と言ったら、めちゃくちゃなコードが出てきた。でも「ダッシュボードだけ作って」に変えた瞬間、完璧なUIが出てきた。AIへの指示は、小さく具体的にが鉄則。",
    cta: "あなたもAI開発始めませんか？",
    hashtags: ["#ClaudeCode", "#AI開発", "#プログラミング"],
    tone: "体験談",
    createdAt: "2026-03-26T09:00:00Z",
  },
];

export const dummyIdeas: PostIdea[] = [
  { id: "i1", theme: "AI時代の学び方", memo: "従来の学習法 vs AI活用学習法の対比", createdAt: "2026-03-26T08:00:00Z" },
  { id: "i2", theme: "副業の始め方", memo: "スキル不要で始められる副業3選", createdAt: "2026-03-25T08:00:00Z" },
  { id: "i3", theme: "時間管理術", memo: "朝の1時間の使い方で人生が変わる", createdAt: "2026-03-24T08:00:00Z" },
];

export const dummyPersona: Persona = {
  id: "per1",
  name: "テック太郎",
  firstPerson: "僕",
  writingStyle: "カジュアルだけど信頼感のある文体",
  endings: ["〜だと思う", "〜なんですよね", "〜してみてください"],
  ngExpressions: ["絶対に", "誰でも簡単に", "裏ワザ"],
  values: "実体験ベースで嘘をつかない。初心者に寄り添う。",
  targetAudience: "20-30代のプログラミング初心者・副業に興味がある会社員",
  expertTopics: ["AI開発", "Claude Code", "Web開発", "副業"],
  ctaStyle: "押し付けず、自然に行動を促す",
};

export const kpiData = {
  totalImpressions: 106200,
  totalLikes: 1904,
  totalRetweets: 579,
  avgEngagementRate: 2.34,
};
