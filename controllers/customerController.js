const { Customer } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const store = async (req, res) => {
  const customer = await Customer.findOne({ where: { email: req.body.user.email } });

  if (!customer) {
    return res.status(404).json({ msg: "User already exists" });
  }

  await Customer.create({
    firstName: req.body.user.firstname,
    lastName: req.body.user.lastname,
    email: req.body.user.email,
    password: req.body.user.password,
    address: req.body.user.address,
    phone: req.body.user.phone,
    orderList: {},
  })
    .then(() => {
      res.status(201).json("created");
    })
    .catch((error) => {
      res.status(409).json({ error });
    });
};

async function login(req, res) {
  const customer = await Customer.findOne({ where: { email: req.body.user.email } });

  if (!customer) {
    return res.status(404).json({ msg: "User not found" });
  }
  const verified = await customer.comparePassword(req.body.user.password);

  if (!verified) {
    return res.status(401).json({ msg: "Invalid Password" });
  }
  const token = jwt.sign(
    { id: customer.id, firstName: customer.firstName },
    process.env.JWT_SECRET,
  );
  res.status(200).json({ token });
}

async function payment(req, res) {
  res.status(200).json({ success: "success" });
}

async function index(req, res) {
  const customer = await Customer.findAll();
  res.status(200).json(customer);
}
// Otros handlers...
// ...

module.exports = {
  index,
  store,
  login,
  payment,
};
