import express from "express";
import {getUsers, deleteUser, createUser, updateUser, addTransaction, getTransaction, getIncome, getExpense, deleteTransaction} from "../Controllers/users.js";
import {updateTransaction} from "../Controllers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.post("/add", createUser);
router.put("/users/:id", updateUser);

router.post("/addTransaction", addTransaction);
router.get("/getTransactions", getTransaction);
router.get("/getIncome", getIncome);
router.get("/getExpense", getExpense)
router.delete("/deleteTransaction/:id", deleteTransaction);
router.put("/updateTransaction/:id", updateTransaction);
router.get("/getTransaction/:id", getTransaction);

router.get("/getTransactions/:date1/:date2", getTransaction);

export default router;