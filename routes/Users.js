const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

router.post(
  "/",
  [
    check("username", "Username is required").not().isEmpty(),

    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      const user = await Users.findOne({ where: { username: username } });
      if (user) return res.json({ msg: "User already exists" });

      bcrypt.hash(password, 10).then((hash) => {
        Users.create({
          username: username,
          password: hash,
        });
        res.json("Registration Successfull");
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),

    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) res.json({ error: "User Doesn't Exist" });

    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) res.json({ error: "You Entered Wrong Password" });

      const accessToken = sign(
        { username: user.username, id: user.id },
        "importantsecret"
      );
      res.json({
        token: accessToken,
        username: username,
        id: user.id,
        msg: "Login Successfull",
      });
    });
  }
);

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

/*router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong  Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});
*/

router.post("/resetpassword", async (req, res) => {
  const { username, newPassword } = req.body;
  try{
    const user = await Users.findOne({ where: { username: username} });
    if(!user){
      return res.json({error : "User not Found!"});
    }
    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: username } }
      );
      res.json({msg : "Password Changed Successfully"});
    });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
