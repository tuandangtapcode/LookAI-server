export interface IRegisterSuccess {
  fullName: string
  outfitAdviceUrl: string
}

export interface IAttachment {
  filename: string
  path: string
}

export interface ISendMailJob {
  to: string
  subject: string
  template: string
  data: IRegisterSuccess
  attachments?: IAttachment[]
}
