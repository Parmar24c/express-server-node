const express = require('express');
const router = express.Router();

const { User } = require('../models/user_model');
const apiResponse = require('../helpers/api_response');

let users = [
    new User(1, 'Nayan'),
    new User(2, 'Amit'),
];

const Paths = {
    test: '/test-body',
    users: '/',
    activeUsers: '/active',
    userDetail: '/:id',
    addUser: '/add',
    updateUser: '/update/:id',
    changeActiveStatus: '/active_status/:id',
    deleteUser: '/delete/:id'
};

router.post(Paths.test, (req, res) => {
    console.log("req body:", JSON.stringify(req.body, null, 2));
    let name = req.body.name + "received";
    res.json(apiResponse(true, 'Body received', {
        'name': name
    }, {
        "token": "dfasdkfjaejasjgw35ouq3k4j5kej53"
    },));
});


router.get(Paths.users, (_, res) => {
    res.json(apiResponse(true, 'Users fetched', users))
});

router.get(Paths.activeUsers, (req, res) => {
    const activeUsers = users.filter(user => user.active);
    res.json(apiResponse(true, 'Active users fetched', activeUsers))
});

router.get(Paths.userDetail, (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    user
        ? res.json(apiResponse(true, 'User found', user))
        : res.json(apiResponse(false, 'User not found'));
});

router.post(Paths.addUser, (req, res) => {
    const { name } = req.body;
    const newUser = new User(users.length + 1, name);
    users.push(newUser);
    res.json(apiResponse(true, 'User created', newUser));
});

router.post(Paths.updateUser, (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) res.json(apiResponse(false, 'User not found'))
    user.name = req.body.name;
    res.json(apiResponse(true, 'User updated', user))
});

router.post(Paths.changeActiveStatus, (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) res.json(apiResponse(false, 'User not found'))
    user.active = req.body?.active ?? !user.active;
    res.json(apiResponse(true, 'Active status updated', user))
});

router.post(Paths.deleteUser, (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.json(apiResponse(true, 'User deleted successfully'))
});

module.exports = router;
