export function parseToPayload<T>(data: T): T {
  Object.keys(data).forEach(key => {
    if (data[key] === '') {
      data[key] = null;
    }
  });
  return data;
}
