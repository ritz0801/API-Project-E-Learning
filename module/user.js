const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    hoTen: String,
    taiKhoan: String,
    matKhau: String,
    soDienThoai: String,
    email: String,
    maLoaiNguoiDung: String,
    tenLoaiNguoiDung: String,
    mangKhoaHoc: Array,
})

const UserSchema = mongoose.model('User', UserSchema);
module.exports = User;