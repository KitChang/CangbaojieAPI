/*
var passport = require("passport");
var WechatStrategy = require("passport-wechat");

passport.use(new WechatStrategy({
    appID: "wxd28c85eb2e4b9769",
    appSecret: "d4624c36b6795d1d99dcf0547af5443d",
    client: "web",
    callbackURL: "/auth/callback",
    scope: "snsapi_base",//{snsapi_userinfo|snsapi_base},
    state: "state",
    agent: "wechat"
} , function (accessToken, refreshToken, profile, done) {
    console.log("wechat");
    return done(err, profile);
}));
*/

/*module.exports = {
  http: {
    customMiddleware: function(app){
      console.log('Express midleware for passport');
      app.use(passport.initialize());
    }
  }
};*/