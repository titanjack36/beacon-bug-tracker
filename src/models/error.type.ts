export type HttpError = {
  status: number;
  data: {
    message: string;
  };
};