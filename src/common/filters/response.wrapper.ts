export const responseData = (data: any, meta?: any) => ({
  success: true,
  data,
  meta: meta || undefined,
});


export const responseNovo = (status: boolean, ordenServicio: any, message: string, codigoRespuesta: number, mensajeError: string) => ({
  status,
  message,
  payload: {
    msg: {
      codigoRespuesta,
      mensajeError
    },
    ordenServicio
  }
});
