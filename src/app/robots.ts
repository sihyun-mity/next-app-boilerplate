import type { MetadataRoute } from 'next';

/**
 * `/robots.txt` 응답을 생성하는 App Router 메타 라우트.
 *
 * 기본값은 모든 봇에 대해 전체 경로 크롤링 허용이다. 비공개 페이지를 도입하면
 * `disallow` 항목을 추가하거나, 환경별로 다른 정책이 필요하면 `process.env.NODE_ENV`
 * 등을 분기해 사용한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
