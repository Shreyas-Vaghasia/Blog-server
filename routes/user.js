const express = require('express');
const User = require('../models/users.model');
const router = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware');


// Endpoint for fetching data of a  User 
router.route('/:username').get(middleware.checkToken, (req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        res.json({
            data: result,
            username: req.params.username,
        }
        );
    });
});

//Endpoint for checking unique username
router.route('/checkusername/:username').get((req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if(result !== null) {

            return res.json({
                status: "true",

            });
        }
        else 
        return res.json({
            status: "false",

        }
        );

    });
});




// Endpoint for Log in  User 
router.route('/login').post(middleware.checkToken, (req, res) => {
    User.findOne({ username: req.body.username }, (err, result) => {
        if (err) res.status(500).json({ msg: err });

        if (result === null) {
            return res.status(403).json('Invalid Username ');

        }
        if (result.password === req.body.password) {
            let token = jwt.sign({ username: req.body.username }, config.key, {
                expiresIn: "7d" //Expires in 24hrs
            })
            res.json({
                token: token,
                msg: 'Success'
            });
        }
        else {
            res.status(403).json("Incorrect Pasword");
        }
    });
});



// Endpoint for Registering a new User 
router.route('/register').post(middleware.checkToken, (req, res) => {
    console.log('Inside the Register');
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,

    });
    user.
        save().
        then(() => {
            console.log('User Registered');
            res.status(200).json('OK');

        })
        .catch(
            (err) => {
                res.status(403).json({ msg: err });

            }
        );

}
);

// Endpoint for updating the Password of User
router.route('/update/:username').patch(middleware.checkToken, (req, res) => {
    User.findOneAndUpdate(
        { username: req.params.username },
        { $set: { password: req.body.password } },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            const msg = {
                msg: 'Password updated Succesfully',
                username: req.params.username
            };
            return res.json(msg);

        }

    );
}
);

// Endpoint for Deleting the User
router.route('/delete/:username').delete(middleware.checkToken, (req, res) => {
    User.findOneAndDelete(
        { username: req.params.username },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });

            const msg = {
                msg: 'User Deleted Succesfully',
                username: req.params.username,
            };
            return res.json(msg);
        }


    );
});



module.exports = router;