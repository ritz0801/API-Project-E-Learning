const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    hoTen: String,
    taiKhoan: String,
    matKhau: String,
    soDienThoai: String,
    email: String,
    ngayTao: { type: Date, default: Date.now },
    maLoaiNguoiDung: { type: String, default: 'HV' },
    mangKhoaHoc: Array,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;