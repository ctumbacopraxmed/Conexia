export const responseData = (data: any, meta?: any) => ({
  success: true,
  data,
  meta: meta || undefined,
});
