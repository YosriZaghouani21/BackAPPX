const express = require("express");
const {
  GetOrder,
  AddOrder,
  GetOrderByID,
  DeleteOrder,
  getAllOrdersByProject,
} = require("../controllers/orderController");
const Router = express.Router();

Router.get("/getAllOrdersByProject/:projectId", getAllOrdersByProject);
Router.get("/orders", GetOrder);
Router.post("/addorder", AddOrder);
Router.get("/:orderId", GetOrderByID);
Router.delete("/:orderID", DeleteOrder);

module.exports = Router;