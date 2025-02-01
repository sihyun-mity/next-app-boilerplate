export const getFulfilledResults = <T>(result: PromiseSettledResult<T>[]) =>
  result.filter(({ status }) => status === 'fulfilled').map((v) => (v as PromiseFulfilledResult<T>).value);

export const getRejectedResults = <T>(result: PromiseSettledResult<T>[]) =>
  result.filter(({ status }) => status === 'rejected').map((v) => v as PromiseRejectedResult);
