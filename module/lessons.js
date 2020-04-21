const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    idCourse: String,
    tieuDe: { type: String, unique: true },
    linkVideo: String,
});

const Lesson = mongoose.model('Lesson', LessonSchema);
module.exports = Lesson;