const HTTP_RESPONSE = {
  COMMON: {
    GET_DATA_SUCCESS: 'Lấy dữ liệu thành công',
    HAVE_AN_ERROR: 'Có lỗi xảy ra'
  },
  AUTHORIZATION: {
    TOKEN_NOT_EXIST: 'Token không tồn tại',
    TOKEN_WITHOUT_DATA: 'Token không có dữ liệu',
    NO_ACCESS: 'Không có quyền truy cập',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
    LOGIN_SUCCESS: 'Đăng nhập thành công'
  },
  SYSTEM_KEY: {
    CREATED_SUCCESS: 'Thêm system key thành công',
    KEY_NAME_EXIST: 'KeyName đã tồn tại',
    INSERT_CHILD_KEY_SUCCESS: 'Thêm child key thành công',
    KEY_NOT_EXIST: 'System key không tồn tại'
  },
  USER: {
    EMAIL_EXIST: 'Email đã tồn tại',
    EMAIL_NOT_EXIST: 'Email không tồn tại',
    USER_NAME_EXIST: 'Tên tài khoản đã tồn tại',
    USER_NOT_EXIST: 'Người dùng không tồn tại',
    UPDATE_PROFILE_SUCCESS: 'Cập nhật tài khoản thành công',
    USER_SUBSCRIPTION_NOT_EXIST: 'Người dùng chưa có gói đăng ký'
  },
  ITEM_TYPE: {
    CREATED_SUCCESS: 'Thêm loại trang phục thành công',
    ITEM_TYPE_EXIST: 'Loại trang phục đã tồn tại',
    ITEM_TYPE_NOT_EXIST: 'loại trang phục không tồn tại',
    UPDATED_SUCCESS: 'Chỉnh sửa loại trang phục thành công'
  },
  FILE: {
    UPLOAD_FILE_SUCCESS: 'Upload file thành công'
  },
  WARDROBE: {
    CREATED_SUCCESS: 'Thêm trang phục thành công',
    WARDROBE_NOT_EXIST: 'Trang phục không tồn tại',
    UPDATED_SUCCESS: 'Chỉnh sửa trang phục thành công'
  },
  PACKAGE: {
    CREATED_SUCCESS: 'Thêm gói thành công',
    PACKAGE_EXIST: 'Gói đã tồn tại',
    PACKAGE_NOT_EXIST: 'Gói không tồn tại',
    UPDATED_SUCCESS: 'Chỉnh sửa gói thành công'
  },
  USER_SUBSCRIPTION: {
    SUBSCRIPTION_NOT_EXIST: 'Gói đăng ký không tồn tại',
    UPDATE_USER_SUBSCRIPTION_SUCCESS: 'Cập nhật gói đăng ký thành công',
    USER_SUBSCRIPTION_EXPIRED: 'Gói đăng ký đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.'
  },
  OUTFIT_ADVICE: {
    CREATED_SUCCESS: 'Thêm gợi ý trang phục thành công',
    USED_UP_ALL_AVAILABLE_CONSULTATIONS:
      'Bạn đã sử dụng hết số lần tư vấn trong gói đăng ký. Vui lòng nâng cấp gói để tiếp tục sử dụng dịch vụ.',
    OUTFIT_ADVICE_NOT_EXIST: 'Gợi ý trang phục không tồn tại',
    FEEDBACK_OUTFIT_ADVICE_SUCCESS: 'Phản hồi gợi ý trang phục thành công'
  },
  PAYMENT: {
    CREATE_PAYMENT_SUCCESS: 'Tạo giao dịch thành công'
  },
  EXPENSE: {
    CREATE_EXPENSE_SUCCESS: 'Tạo chi phí thành công',
    UPDATE_EXPENSE_SUCCESS: 'Cập nhật chi phí thành công',
    EXPENSE_NOT_EXIST: 'Chi phí không tồn tại'
  }
}

export default HTTP_RESPONSE
