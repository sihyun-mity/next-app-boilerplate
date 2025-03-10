export const sleep = async (delay: number): Promise<NodeJS.Timeout> =>
  new Promise((resolve) => setTimeout(resolve, delay));
