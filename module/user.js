const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    hoTen: String,
    taiKhoan: { type: String, unique: true },
    matKhau: String,
    soDienThoai: String,
    email: String,
    avatar: { type: String, default: 'https://res.cloudinary.com/avata-user-store/image/upload/v1587982981/n6rdmmtxyjr0gttp8zo7.png' },
    ngayTao: { type: Date, default: Date.now },
    maLoaiNguoiDung: { type: String, default: 'HV' },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;