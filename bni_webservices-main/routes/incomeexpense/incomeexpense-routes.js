const express = require("express");
const router = express.Router();
const moment = require('moment'); 
var mysqlConnection = require('../../connection');

const APIResponse = {
  Success: 0,
  Failed: 1,
  ServerError: 2
}
const getExpenseList = 'SELECT * FROM income_expense_entry ';

router.get("/", (req, res) => {
    mysqlConnection.query(getExpenseList, (err, expenseRows) => {
      if (err) {
        let response = {
          "status": APIResponse.ServerError,
          "expenseList": []
      }
      res.send(response);
      } else {
        let response = {
          "status": APIResponse.Success,
          "expenseList": expenseRows
      }
      res.send(response);
      }
    });
});

// Create a new expense entry
router.post("/", (req, res) => {
    const { date, refnum, ledgername, income, amount, notes } = req.body;
  
    // Parse the date string using moment.js
    const parsedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  
    mysqlConnection.query(
      "INSERT INTO income_expense_entry (entry_date, refnum, ledgername, income, amount, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [parsedDate, refnum, ledgername, income, amount, notes],
      (err, result) => {
        if (err) {
          console.log(err);
          let response = {
            "status": APIResponse.ServerError,
            message: "Error creating Expense entry"
          };
  
          res.send(response);
        } else {
          let response = {
            "status": APIResponse.Success,
            message: "Expense Entry created successfully"
          };
  
          res.send(response);
        }
      }
    );
  });
  
// Update a ledger
router.put("/:ledgerId", (req, res) => {
    const ledgerId = req.params.ledgerId;
    const { ledger_name, ledger_type, status } = req.body;
    mysqlConnection.query(
      "UPDATE ledger_master SET ledger_name=?, ledger_type=?, status=? WHERE ledger_id=?",
      [ledger_name, ledger_type, status, ledgerId],
      (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).json({ message: "Error updating ledger" });
        } else {
          res.status(200).json({ message: "Ledger updated successfully" });
        }
      }
    );
});

// Delete a ledger
router.delete("/:ledgerId", (req, res) => {
  const ledgerId = req.params.ledgerId;

  const sqlQuery = "UPDATE ledger_master SET status='Inactive' WHERE ledger_id=? AND status='Active'";


  mysqlConnection.query(sqlQuery, [ledgerId], (err, result) => {
    if (err) {
      console.error("Error updating ledger status:", err);
      res.status(500).json({ message: "Error updating ledger status" });
    } else {
      console.log("Query Result:", result);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Ledger deleted successfully" });
      } else {
        res.status(404).json({ message: "No active ledger found for status update" });
      }
    }
  });
});





module.exports = router;
