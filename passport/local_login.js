const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    passReqToCallback: true
}, (req, id, password, done) => {
    console.log('local_login의 콜백 함수 호출됨 : ' + id + ', ' + password);

    let success = true;
    if (success) {
        const user = {
            id: id,
            password: password
        }

        return done(null, user);
    } else {
        return done(null, false, req.flash('loginMessage', 'local_login failed.'));
    }

});

