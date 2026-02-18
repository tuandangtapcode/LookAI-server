import env from 'src/config/env'

export const response = <T>(data: T, error: boolean, msg: string) => {
  return { data, error, msg }
}

export const generateSignature = (data: string) => {
  const hmac = CryptoJS.HmacSHA256(data, env.PAYOS_CHECKSUM_KEY)
  const signature = hmac.toString(CryptoJS.enc.Hex)
  return signature
}

export const formatMoney = (money: number) => {
  return (Math.round(money * 100) / 100).toLocaleString().replaceAll(',', '.')
}
