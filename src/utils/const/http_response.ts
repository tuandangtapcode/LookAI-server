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
    UPDATE_PROFILE_SUCCESS: 'Cập nhật tài khoản thành công'
  }
}

export default HTTP_RESPONSE
