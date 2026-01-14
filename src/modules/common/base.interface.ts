export interface IBaseData {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IButtonShow {
  isCreate?: boolean
  isUpdate?: boolean
  isDelete?: boolean
}
