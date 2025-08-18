// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // 기존 환경변수들
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    DATABASE_URL: string;
    DIRECT_URL: string;

    // 기타
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_KAKAO_MAP_API_KEY: string;
    NEXT_PUBLIC_KAKAO_REST_API_KEY: string;
  }
}

// 글로벌 window 객체 확장 (필요시)
declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}
