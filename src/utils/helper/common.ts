export const response = <T>(data: T, error: boolean, msg: string) => {
  return { data, error, msg }
}
