const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
//const uploader = require("./../config/cloudinary");
//const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const UserModel = require ("./../model/User");


router.get("/signin", (req,res, next)=>{

    res.render('auth/signin.hbs');

});
router.get("/signup", (req,res, next)=>{

    res.render('auth/signup.hbs');

});

router.get( "/signout", (req, res, next)=> { 
 req.session.destroy(function (err)
 {
     res.redirect("/auth/signin");
 });
});


router.post("/signin", async (req, res, next) => {
    // DO something
    //   res.render("auth/signin.hbs");
    const { email, password } = req.body;
    const foundUser = await UserModel.findOne({ email: email });
  
    if (!foundUser) {
      //   Display an error message telling the user that either the password
      // or the email is wrong
      req.flash("error", "Invalid credentials");
      res.redirect("/auth/signin");
      // res.render("auth/signin.hbs", { error: "Invalid credentials" });
    } else {
      // https://www.youtube.com/watch?v=O6cmuiTBZVs
      const isSamePassword = bcrypt.compareSync(password, foundUser.password);
      if (!isSamePassword) {
        // Display an error message telling the user that either the password
        // or the email is wrong
        req.flash("error", "Invalid credentials");
        res.redirect("/auth/signin");
        // res.render("auth/signin.hbs", { error: "Invalid credentials" });
      } else {
        // everything is fine so :
        // Authenticate the user...
        const userObject = foundUser.toObject();
        delete userObject.password; // remove password before saving user in session
        // console.log(req.session, "before defining current user");
        req.session.currentUser = userObject; // Stores the user in the session (data server side + a cookie is sent client side)
  
    
        req.flash("success", "Successfully logged in...");
        res.redirect("/dashboard");
      }
    }
  });

  router.post("/signup", async (req, res, next) => {
    try {
      const newUser = { ...req.body };
      const foundUser = await UserModel.findOne({ email: newUser.email });
  
      if (foundUser) {
        req.flash("warning", "Email already registered");
        res.redirect("/auth/signup");
      } else {
        const hashedPassword = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hashedPassword;
        await UserModel.create(newUser);
        req.flash("success", "Congrats ! You are now registered !");
        res.redirect("/auth/signin");
      }
    } catch (err) {
      let errorMessage = "";
      for (field in err.errors) {
        errorMessage += err.errors[field].message + "\n";
      }
      req.flash("error", errorMessage);
      res.redirect("/auth/signup");
    }
});

  module.exports = router;