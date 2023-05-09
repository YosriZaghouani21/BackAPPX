const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const Project = require("../models/projectModel.js");
const User = require("../models/User.js");

// Handle incoming GET requests to /orders
exports.GetOrder = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "products.product",
                select: "name price",
                model: Product,
            })
            .populate({
                path: "customer",
                select: "name",
                model: User,
            })
            .exec();

        const response = {
            count: orders.length,
            orders: [],
        };

        for (const order of orders) {
            if (order.products.length === 0) {
                // delete order with no products
                await Order.deleteOne({ _id: req.params.orderId }).exec();
            } else {
                response.orders.push({
                    _id: order._id,
                    products: order.products,
                    status: order.status,
                    customerName: order.customer.name,
                    createdAt: order.createdAt,
                    totalPrice: order.totalPrice,
                    request: {
                        type: "GET",
                        url: `http://localhost:9092/orders/${order._id}`,
                    },
                });
            }
        }

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};

// exports.AddOrder = async (req, res) => {
//     try {
//         const { customerId, products } = req.body;

//         console.log(`Fetching customer with ID: ${customerId}`);
//         const customer = await User.findById(customerId);
//         console.log(customer);

//         if (!customer) {
//             return res.status(400).json({ message: "Customer not found" });
//         }

//         // Create an array to hold the product instances
//         const productInstances = [];

//         // Loop over the products array and create a product instance for each product
//         for (let i = 0; i < products.length; i++) {
//             const { productId, quantity, price, status } = products[i];
//             console.log(`Fetching product with ID: ${productId}`);
//             const product = await Product.findById(productId);
//             console.log(product);

//             if (!product) {
//                 return res.status(400).json({ message: "Product not found" });
//             }

//             const productInstance = {
//                 product,
//                 quantity,
//                 price,
//                 status,
//             };

//             productInstances.push(productInstance);
//         }

//         // Create a new order instance for the customer with the product array
//         const newOrder = new Order({
//             customer,
//             products: productInstances,
//         });

//         // Save the order to the database
//         const savedOrder = await newOrder.save();

//         console.log(`Order after save: ${savedOrder}`);

//         // Send the saved order as a response
//         res.json(savedOrder);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

exports.AddOrder = async (req, res) => {
    try {
        const { customerId, projectId, products } = req.body;

        console.log(`Fetching customer with ID: ${customerId}`);
        const customer = await User.findById(customerId);
        console.log(customer);

        if (!customer) {
            return res.status(400).json({ message: "Customer not found" });
        }

        console.log(`Fetching project with ID: ${projectId}`);
        const project = await Project.findById(projectId);
        console.log(project);

        if (!project) {
            return res.status(400).json({ message: "Project not found" });
        }

        const productInstances = [];

        let totalPrice = 0;
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity, price, status } = products[i];
            console.log(`Fetching product with ID: ${productId}`);

            try {
                const product = await Product.findById(productId);
                console.log(product);

                if (!product) {
                    return res.status(400).json({ message: "Product not found" });
                }

                if (product.quantity < quantity) {
                    return res.status(400).json({ message: "Product not available" });
                }

                const productInstance = {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity
                };

                productInstances.push(productInstance);

                totalPrice += quantity * price;
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server Error" });
            }
        }

        const newOrder = new Order({
            customer,
            project,
            products: productInstances,
            totalPrice,
        });

        const savedOrder = await newOrder.save();

        console.log(`Order after save: ${savedOrder}`);

        project.orders.push(savedOrder);
        await project.save();

        res.json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllOrdersByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const orders = await Order.find({ project: projectId })
            .populate({
                path: "products",
                select: "name price",
                model: Product,
            })
            .populate({
                path: "customer",
                select: "name",
                model: User,
            })
            .exec();

        const response = {
            count: orders.length,
            orders: [],
        };

        for (const order of orders) {
            if (order.products.length === 0) {
                // delete order with no products
                await Order.deleteOne({ _id: req.params.orderId }).exec();
            } else {
                response.orders.push({
                    _id: order._id,
                    products: order.products,
                    customerName: order.customer.name,
                    createdAt: order.createdAt,
                    totalPrice: order.totalPrice,
                    request: {
                        type: "GET",
                        url: `http://localhost:9092/orders/${order._id}`,
                    },
                });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};



// Show order / GET BY ID
exports.GetOrderByID = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate({
                path: "product",
                select: "name price",
                model: Product,
            })
            .exec();
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: "GET",
                url: "http://localhost:9092/orders",
            },
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};
//Delete order with ID
exports.DeleteOrder = async (req, res) => {
    try {
        const result = await Order.deleteOne({ _id: req.params.orderId }).exec();
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: { productId: "ID", quantity: "Number" },
            },
        });
    } catch (err) {
        res.status(500).json({
            error: err,
        });
    }
};