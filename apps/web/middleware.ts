// 요청이 완료되기 전에 서버에서 실행되는 코드
// 들어오는 요청에 따라 응답을 수정하거나 리다이렉트, 헤더 수정, 직접 응답 등을 할 수 있음

import { type NextRequest } from 'next/server';

import { updateSession } from './src/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로와 매칭:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - 이미지 파일들 (svg, png, jpg, jpeg, gif, webp)
     * - certificates 폴더 (인증서 관련 파일)
     */
    '/((?!_next/static|_next/image|favicon.ico|certificates|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
