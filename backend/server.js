const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_Sl45SeYFyoJ952",
  key_secret: "RO7ZMU41zR9hXoUUf26FrThZ"
});

app.post("/create-order", async (req, res) => {
  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: "INR"
  });

  res.json(order);
});

app.listen(5000, () => console.log("Server running on port 5000"));
app.get("/", (req, res) => {
  res.send("Backend is running!");
});