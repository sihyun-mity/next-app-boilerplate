import returnFetch, { ReturnFetch } from 'return-fetch';

export const fetchExtended: ReturnFetch = returnFetch({
  baseUrl: '',
  headers: { Accept: 'application/json' },
  interceptors: {
    request: async (args) => {
      return args;
    },

    response: async (response, requestArgs) => {
      if (response.status >= 400) {
        throw await response.text().then(Error);
      }

      return response;
    },
  },
});
