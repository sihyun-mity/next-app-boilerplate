/**
 * `Promise.allSettled` 의 결과 중 성공한 항목의 `value` 만 추출한다.
 *
 * @param result `Promise.allSettled` 의 반환값
 * @returns 성공한 결과의 값 배열 (입력 순서 보존)
 */
export const getFulfilledResults = <T>(result: PromiseSettledResult<T>[]) =>
  result.filter(({ status }) => status === 'fulfilled').map((v) => (v as PromiseFulfilledResult<T>).value);

/**
 * `Promise.allSettled` 의 결과 중 실패한 항목만 추출한다.
 *
 * 반환값은 `PromiseRejectedResult[]` 이며 각 항목의 `reason` 으로 실패 사유에 접근한다.
 *
 * @param result `Promise.allSettled` 의 반환값
 */
export const getRejectedResults = <T>(result: PromiseSettledResult<T>[]) =>
  result.filter(({ status }) => status === 'rejected').map((v) => v as PromiseRejectedResult);

/**
 * 지정한 시간(ms) 동안 대기하는 비동기 헬퍼.
 *
 * `setTimeout` 을 Promise 로 감싼 단순 슬립이며, 테스트 코드나 디바운스 시뮬레이션 등에
 * 사용한다. 반환되는 Promise 의 값은 `setTimeout` 핸들이지만 실사용은 거의 없다.
 *
 * @param delay 대기할 밀리초
 * @example
 * await sleep(300); // 300ms 대기 후 다음 줄 실행
 */
export const sleep = async (delay: number): Promise<NodeJS.Timeout> =>
  new Promise((resolve) => setTimeout(resolve, delay));
