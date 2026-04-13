import { NextRequest, NextResponse } from 'next/server';

/**
 * App Router API Cross-Origin 허용
 * @example export const GET = allowCors(handler);
 */
export const allowCors = (fn: (req: NextRequest) => Promise<NextResponse>) => async (req: NextRequest) => {
  const origin = req.headers.get('origin') || '*';

  /** OPTIONS Preflight 처리 */
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers':
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      },
    });
  }

  /** API 요청 실행 */
  const response = await fn(req);

  /** 응답 헤더 설정 */
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return response;
};
