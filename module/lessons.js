const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    idCourse: String,
    tieuDe: String,
    linkVideo: String,
});

const Lesson = mongoose.model('Lesson', LessonSchema);
module.exports = Lesson;