const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    hoTen: String,
    taiKhoan: { type: String, unique: true },
    matKhau: String,
    soDienThoai: String,
    email: String,
    avatar: String,
    ngayTao: { type: Date, default: Date.now },
    maLoaiNguoiDung: { type: String, default: 'HV' },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;