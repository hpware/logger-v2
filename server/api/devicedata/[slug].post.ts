export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { dataid } = body;
  if (dataid === 0) {
    return {
      cached: true,
      dataid: 0,
    };
  }
  return {
    cached: false,
    dataid: dataid,
  };
});
