if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session"); //for storing the session in the form of cookies
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

//connecting to mongoose
const MONGO_URL = process.env.MONGO;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//connecting to mongoose

app.set("view engine", "ejs"); //because we are using the ejs
app.set("views", path.join(__dirname, "views")); //so the views folder is connected and we can render the UI
app.use(express.urlencoded({ extended: true })); // GPT in short important line to extract the data form or any kind of submission
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false, //Setting resave to false is generally the recommended practice. With this setting, the session is only saved back to the store when it has been explicitly modified
  saveUninitialized: true, //forces a session to be saved to the session store even if it is new but not modified.

  cookie: {
    //time limit till which the cookies will stay
    expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //to prevent from the cross scripting attacks.
  },
};

app.use(session(sessionOptions)); //for the cookies
app.use(flash()); //npm package for the error message display

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //this User is in the models.

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  //flash npm package to show the success message
  res.locals.success = req.flash("success"); //koi bhi success message is saved in res.locals.success same for all below
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //used in navbar.ejs to authenticate
  next(); //!!!important other we will be stuck
});

app.use("/listings", listingRouter); //show route
app.use("/listings/:id/reviews", reviewRouter); // new route
app.use("/", userRouter);

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong ‼️" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
