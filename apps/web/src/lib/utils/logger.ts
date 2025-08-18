export const logger = {
  error: (message: string, error?: Error) => {
    console.error(message, error);
  },

  info: (message: string) => {
    console.log(message);
  },
};
