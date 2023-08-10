const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        console.log(email)
        const user = await getUserByEmail(email)
        console.log(user)
        if(user == null) {
            return done(null, false, {message: 'No user with that email'})
        }
        try{
            if(await bcrypt.compare(password, user.password)) {
               return done(null, user)
            } else {
                return done(null, false, {message: 'Password Incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => {
       done(null, user._id)
    })
    passport.deserializeUser( async (_id, done) => {
        done(null, await getUserById(_id))
    })
}
module.exports = initialize