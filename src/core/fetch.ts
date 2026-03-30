import returnFetch from 'return-fetch';

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
