const { sign, verify } = require('jsonwebtoken');

const SECRET_KEY = "voanhdung";

const signPromise = (object) => {
    return new Promise((resolve, reject) => {
        sign(object, SECRET_KEY, { expiresIn: '10 days' }, (error, token) => {
            if (error) return reject(error)
            resolve(token);
        });
    });
}
const verifyPromise = (token) => {
    return new Promise((resolve, reject) => {
        verify(token, SECRET_KEY, (error, object) => {
            if (error) return reject(error)
            resolve(object);
        });
    });
}

module.exports = { verifyPromise, signPromise }