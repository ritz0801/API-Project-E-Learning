const mongoose = require('mongoose');
const Course = require('./module/courses');
const User = require('./module/user');
const express = require('express');
const cors = require('cors')
const { json } = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();


app.use(json());
app.use(cors());
mongoose.connect('mongodb+srv://abc:12345678910@course-eon1f.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error" + err))

// const newCourse = new Course({
//     maKhoaHoc: "1",
//     biDanh: "Ritz",
//     tenKhoaHoc: "MongoDB",
//     moTa: "Hoc databse bang MongoDB",
//     hinhAnh: "http://elearning0706.cybersoft.edu.vn/hinhanh/nodejs.jpg",
//     taiKhoanNguoiTao: "ritz0801"
// });

// newCourse.save()
//     .then(console.log)

app.get('/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc', (req, res) => {
    Course.find({})
        .then(courses => res.send({ success: true, courses }))
        .catch(err => res.set({ success: false, err }))
});

app.post("/api/QuanLyKhoaHoc/ThemKhoaHoc", (req, res) => {
    const { tenKhoaHoc, moTa, hinhAnh, luotXem, taiKhoanNguoiTao, maDanhMuc } = req.body
    if (tenKhoaHoc.trim() === '' || moTa.trim() === '' || hinhAnh.trim() === '' || luotXem.trim() === '' || taiKhoanNguoiTao.trim() === '' || maDanhMuc.trim() === '') {
        res.status(401);
        return res.send({ success: false, message: "Emty value" });
    }
    const newCourse = new Course({ tenKhoaHoc, moTa, hinhAnh, luotXem, taiKhoanNguoiTao, maDanhMuc })
    newCourse.save()
        .then(course => res.send({ success: true, data: course }))
        .catch(error => res.send({ success: false, message: error }))
})

app.delete("/api/QuanLyKhoaHoc/XoaKhoaHoc", async (req, res) => {
    const _id = req.query._id;
    Course.findOneAndRemove(_id)
        .then(course => res.send({ success: true, data: course }))
        .catch(error => res.send({ success: false, message: error }))
})

app.put('/api/QuanLyKhoaHoc/SuaKhoaHoc', (req, res) => {
    const _id = req.query._id;
    const { tenKhoaHoc, moTa, hinhAnh, luotXem, taiKhoanNguoiTao, maDanhMuc } = req.body;

    Course.findOneAndUpdate({ _id }, { tenKhoaHoc, moTa, hinhAnh, luotXem, taiKhoanNguoiTao, maDanhMuc }, { new: true })
        .then(course => {
            if (!course) throw new Error("EMPTY_COURSE");
            res.send({ success: true, course: course });
        })
        .catch(error => res.send({ success: false, message: error.message }));

});

app.get('/api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc', async (req, res) => {
    try {
        const maDanhMuc = req.query.maDanhMuc;
        const courses = await Course.find({ maDanhMuc })
        res.status(200).send({ success: true, courses })

    } catch (error) {
        res.status(error.status).set({ success: false, err })
    }
})

//USER

app.post('/api/QuanLyNguoiDung/DangKy', async (req, res) => {
    try {
        const { hoTen, taiKhoan, matKhau, soDienThoai, email } = req.body;
        const user = new User({ hoTen, taiKhoan, matKhau, soDienThoai, email });
        const newUser = await user.save();
        res.status(200).send({ success: true, newUser })
    } catch (error) {
        res.status(error.status).set({ success: false, error })
    }
})

app.post('/api/QuanLyNguoiDung/DangNhap', async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;
        const user = await User.findOne({ taiKhoan });
        if (!user) {
            throw new Error();
        }

        const passwordValidated = await bcrypt.compare(matKhau, user.matKhau);
        if (!passwordValidated) {
            throw new Error();
        }

        res.status(200).send({ success: true, user })
    } catch (error) {
        res.status(error.status).set({ success: false, error })
    }
})

app.listen(process.env.PORT || 3005, () => console.log())


