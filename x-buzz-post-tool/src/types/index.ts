export interface PostIdea {
  id: string;
  theme: string;
  memo: string;
  createdAt: string;
}

export interface GeneratedPost {
  id: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  tone: string;
  createdAt: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  scheduledAt: string;
  status: "draft" | "scheduled" | "posted";
  createdAt: string;
}

export interface PostMetric {
  id: string;
  postId: string;
  content: string;
  impressions: number;
  likes: number;
  retweets: number;
  theme: string;
  tone: string;
  postedAt: string;
  hookStrength: number;
  empathy: number;
  shareability: number;
  selfScore: number;
}

export interface Persona {
  id: string;
  name: string;
  firstPerson: string;
  writingStyle: string;
  endings: string[];
  ngExpressions: string[];
  values: string;
  targetAudience: string;
  expertTopics: string[];
  ctaStyle: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
