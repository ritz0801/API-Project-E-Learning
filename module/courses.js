const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    maKhoaHoc: String,
    tenKhoaHoc: String,
    moTa: String,
    hinhAnh: String,
    gia: String,
    luotXem: String,
    taiKhoanNguoiTao: String,
    maDanhMuc: String,
})

const Course = mongoose.model('Course', CourseSchema);



module.exports = Course;