const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (!userParam.email) {
        throw 'Email is a required field';
    }
    if (!userParam.username) {
        throw 'Username is a required field';
    }

    if (!userParam.password) {
      throw 'Password is a required field';
    }

    if(userParam.hash) {
      throw 'Hash is an illegal field';
    }

    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw new Error('UserNotFoundError');
    //if request gave username and username isn't the same as it was and the username is in the database
    if (userParam.username && user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    //if request gave email and email isn't the same as it was and the email is in the database
    if (userParam.email && user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}
async function _delete(id) {
    await User.findByIdAndRemove(id);
}
//based on github.com/cornflourblue/node-mongo-registration-login-api/