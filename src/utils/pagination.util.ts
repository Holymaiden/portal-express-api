export const paginate = async (
  page: number = 1,
  limit: number = 10,
  dataLength: number
) => {
  const start = page === 1 ? 0 : (page - 1) * limit;
  const end = page * limit;
  const totalPage = Math.ceil(dataLength / limit);

  let nextPage = page,
    prevPage = page;

  if (page < totalPage) {
    nextPage = page + 1;
  }
  if (page > 1) {
    prevPage = page - 1;
  }

  return { start, end, totalPage, dataLength, nextPage, prevPage };
};
