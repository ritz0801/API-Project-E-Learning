const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    tenKhoaHoc: String,
    moTa: String,
    hinhAnh: String,
    taiKhoanNguoiTao: String,
    maDanhMuc: String,
    mucLuc: Array,
})

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;