import returnFetch from 'return-fetch';

/**
 * 프로젝트 전역에서 사용하는 확장 fetch.
 *
 * `return-fetch` 의 인스턴스로, 다음 동작이 추가되어 있다.
 * - 기본 `Accept: application/json` 헤더.
 * - 응답 인터셉터에서 4xx / 5xx 응답은 본문을 텍스트로 읽어 `Error` 로 던진다. 호출 측은
 *   try/catch 또는 SWR 등의 에러 처리에 의존할 수 있다.
 *
 * `baseUrl` 은 비워 두었으므로 호출 시 절대/상대 경로를 직접 지정한다. 환경별 baseUrl 이 필요하면
 * 이 파일을 확장하거나 `process.env.NEXT_PUBLIC_API_URL` 같은 값을 주입하도록 수정한다.
 */
export const fetchExtended = returnFetch({
  baseUrl: '',
  headers: { Accept: 'application/json' },
  interceptors: {
    request: async (args) => {
      return args;
    },

    response: async (response) => {
      if (response.status >= 400) {
        throw await response.text().then(Error);
      }

      return response;
    },
  },
});

/**
 * 평탄한 객체를 `multipart/form-data` 용 `FormData` 로 변환한다.
 *
 * - `File` / `Blob` 값은 그대로 추가한다.
 * - 나머지 원시 타입(`string`, `number`, `boolean`)은 `toString()` 결과로 변환되어 추가된다.
 * - `data` 가 `undefined` 면 빈 `FormData` 를 반환한다.
 *
 * 중첩 객체나 배열은 직접 처리하지 않으므로, 필요할 경우 호출 측에서 미리 평탄화해야 한다.
 *
 * @example
 * await fetchExtended('/api/upload', { method: 'POST', body: createFormData({ name: 'a', file }) });
 */
export const createFormData = (data?: Record<string, string | number | boolean | Blob | File>) => {
  const form = new FormData();

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      const isBinaryData = value instanceof File || value instanceof Blob;
      form.append(key, isBinaryData ? value : value.toString());
    });
  }

  return form;
};
