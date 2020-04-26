const mongoose = require('mongoose');
const Course = require('./module/courses');
const User = require('./module/user');
const Lesson = require('./module/lessons');
const Photo = require('./module/photo');
const express = require('express');
const cors = require('cors')
const { json, urlencoded } = require("body-parser");
const { hash, compare } = require('bcryptjs');
const app = express();
const fs = require('fs');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const { verifyPromise, signPromise } = require('./module/jwt');
const crypto = require("crypto");
const Grid = require("gridfs-stream");



// mongodb+srv://abc:12345678910@course-eon1f.mongodb.net/test?retryWrites=true&w=majority
// mongodb://localhost:27017/test
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));

// app.use(multer({
//     dest: './avatar/',
//     rename: function (fieldname, filename) {
//         return filename;
//     },
// }));

const conn = mongoose.createConnection('mongodb+srv://abc:12345678910@course-eon1f.mongodb.net/test?retryWrites=true&w=majority')

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
    const { tenKhoaHoc, moTa, hinhAnh, gia, luotXem, taiKhoanNguoiTao, maDanhMuc, mucLuc } = req.body
    if (tenKhoaHoc.trim() === '' || moTa.trim() === '' || hinhAnh.trim() === '' || luotXem.trim() === '' || taiKhoanNguoiTao.trim() === '' || maDanhMuc.trim() === '') {
        res.status(401);
        return res.send({ success: false, message: "Emty value" });
    }
    const newCourse = new Course({ tenKhoaHoc, moTa, hinhAnh, gia, luotXem, taiKhoanNguoiTao, maDanhMuc, mucLuc })
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
    const { tenKhoaHoc, moTa, hinhAnh, gia, luotXem, taiKhoanNguoiTao, maDanhMuc, mucLuc } = req.body;

    Course.findOneAndUpdate({ _id }, { tenKhoaHoc, moTa, hinhAnh, gia, luotXem, taiKhoanNguoiTao, maDanhMuc, mucLuc }, { new: true })
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
        res.status(400).send({ success: false, error })
    }
})

app.get('/api/QuanLyKhoaHoc/LayThongTinKhoaHoc', async (req, res) => {
    try {
        const _id = req.query._id;
        const courseDetail = await Course.findOne({ _id })
        res.status(200).send({ success: true, courseDetail })
    } catch (error) {
        res.status(401).send({ success: false, error })
    }
})

app.get('/api/QuanLyKhoaHoc/LayDanhSachBaiHoc', (req, res) => {
    Lesson.find({})
        .then(lessons => res.send({ success: true, lessons }))
        .catch(err => res.set({ success: false, err }))
})

app.get('/api/QuanLyKhoaHoc/LayThongTinBaiHoc', async (req, res) => {
    try {
        const _id = req.query._id;
        const lessonDetail = await Lesson.findOne({ _id })
        res.status(200).send({ success: true, lessonDetail })
    } catch (error) {
        res.status(401).send({ success: false, error })
    }
})

app.get('/api/QuanLyKhoaHoc/LuuBaiHoc', async (req, res) => {
    const _id = req.query._id;
    const tieuDe = ["Giới thiệu về ES6", "Hoisting trong JavaScript", "var, let, const", "function context & bind", "Arrow function expression (Part 1)", "Arrow function expression (Part 2)", "Template string", "rest", "spread", "Closure", "Higer order functions", "Destructuring"]
    const linkVideo = [
        "https://www.youtube.com/embed/2LeqilIw-28",
        "https://www.youtube.com/embed/sZ0z7B7QmjI",
        "https://www.youtube.com/embed/KWUcTt15fQs",
        "https://www.youtube.com/embed/RBLIm5LMrmc",
        "https://www.youtube.com/embed/INPob8yPyBo",
        "https://www.youtube.com/embed/XGG-OY8pJqA",
        "https://www.youtube.com/embed/Stne4zasR8M",
        "https://www.youtube.com/embed/ycohYSx5h9w",
        "https://www.youtube.com/embed/u4URamXstM0",
        "https://www.youtube.com/embed/XJEHuBZQ5dU",
        "https://www.youtube.com/embed/dcP039DYzmE",
        "https://www.youtube.com/embed/dcP039DYzmE"
    ]
    for (let i = 0; i < tieuDe.length; i++) {
        const newLesson = new Lesson({
            idCourse: _id,
            tieuDe: tieuDe[i],
            linkVideo: linkVideo[i]
        })
        newLesson.save()
    }
    Lesson.find({})
        .then(data => res.send({ data }));
})

app.get('/api/InsertMucluc', async (req, res) => {
    const _id = req.query._id;

    const arrayMucluc = []

    const data = await Lesson.find({})
    data.map(lesson => {
        if (lesson.idCourse === _id) {
            arrayMucluc.push(lesson)
        }
    })

    if (arrayMucluc.length > 0) {
        Course.findOneAndUpdate({ _id }, { mucLuc: arrayMucluc }, { new: true })
            .then(course => {
                if (!course) throw new Error("EMPTY_COURSE");
                res.send({ success: true, course: course });
            })
            .catch(error => res.send({ success: false, message: error.message }));
    }
});


//USER

app.get('/api/QuanLyNguoiDung/LayDanhSachNguoiDung', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send({ success: true, users })
    } catch (error) {
        res.status(error.status).set({ success: false, error })
    }
})

app.post('/api/QuanLyNguoiDung/DangKy', async (req, res) => {
    try {
        const { hoTen, taiKhoan, matKhau, soDienThoai, email, maLoaiNguoiDung } = req.body;
        const encrypt = await hash(matKhau, 8);
        const user = new User({ hoTen, taiKhoan, matKhau: encrypt, soDienThoai, email, maLoaiNguoiDung });
        if (await User.findOne({ taiKhoan })) {
            res.status(401).send({ success: false, message: "Tài khoản đã tồn tại!" });
            throw 'Tài khoản "' + taiKhoan + '" đã tồn tại!';
        }
        else {
            await user.save();
            res.status(200).send({ success: true, user })
        }
    } catch (error) {
        res.status(401).send({ success: false, error })
    }
})

app.post('/api/QuanLyNguoiDung/DangNhap', async (req, res) => {
    try {
        const { taiKhoan, matKhau } = req.body;
        const user = await User.findOne({ taiKhoan });
        if (!user) {
            return res.status(400).send({ success: false, message: 'INVALID_USER_INFO' })
        }

        const passwordValidated = await compare(matKhau, user.matKhau);
        if (!passwordValidated) {
            return res.status(400).send({ success: false, message: 'INVALID_USER_INFO' })
        }

        const token = await signPromise({ taiKhoan: user.taiKhoan });
        const userInfo = user.toObject();
        userInfo.matKhau = undefined;
        userInfo.token = token;
        res.send({ success: true, user: userInfo });
    } catch (error) {
        res.status(error.status).set({ success: false, error })
    }
})


const storage = new GridFsStorage({
    url: 'mongodb+srv://abc:12345678910@course-eon1f.mongodb.net/test?retryWrites=true&w=majority',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = file.originalname
                const fileInfo = {
                    filename: new Date().getTime() + filename,
                    bucketName: 'uploads',
                }
                resolve(fileInfo)
            })
        })
    },
})

const upload = multer({ storage })

app.put('/api/QuanLyNguoiDung/SuaThongTin', upload.single('avatar'), async (req, res) => {
    try {
        const _id = req.query._id;
        const { matKhau } = req.body;
        const file = req.file;
        if (matKhau && !file) {
            const encrypt = await hash(matKhau, 8);
            User.findOneAndUpdate({ _id }, { matKhau: encrypt }, { new: true })
                .then(newInfoUser => {
                    const user = newInfoUser;
                    user.matKhau = undefined;
                    res.status(200).send({ success: true, user });
                })
        }
        if (file && !matKhau) {
            User.findOneAndUpdate({ _id }, { avatar: req.file.filename }, { new: true })
                .then(newInfoUser => {
                    const user = newInfoUser;
                    user.matKhau = undefined;
                    res.status(200).send({ success: true, user });
                })
        }
        if (matKhau && file) {
            const encrypt = await hash(matKhau, 8);
            User.findOneAndUpdate({ _id }, { matKhau: encrypt, avatar: req.file.filename }, { new: true })
                .then(newInfoUser => {
                    const user = newInfoUser;
                    user.matKhau = undefined;
                    res.status(200).send({ success: true, user });
                })
        }

    }
    catch (err) {
        res.status(401).send({ success: false, message: err.message });
    }
});

let gfs

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
    console.log('Connection Successful')
})
app.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists',
            })
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename)
            readstream.pipe(res)
        } else {
            res.status(404).json({
                err: 'Not an image',
            })
        }
    })
})
app.listen(process.env.PORT || 3005, () => console.log())


