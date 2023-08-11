const express = require("express");
const router = express.Router();

var mysqlConnection = require('../../connection');

const APIResponse = {
  Success: 0,
  Failed: 1,
  ServerError: 2
}
const getLedgerList = 'SELECT * FROM ledger_master ';
// Get all ledgers
router.get("/", (req, res) => {
    mysqlConnection.query(getLedgerList, (err, ledgerRows) => {
      if (err) {
        let response = {
          "status": APIResponse.ServerError,
          "ledgerList": []
      }
      res.send(response);
      } else {
        let response = {
          "status": APIResponse.Success,
          "ledgerList": ledgerRows
      }
      res.send(response);
      }
    });
});

// Create a new ledger
router.post("/", (req, res) => {
    const { ledger_name, ledger_type,status } = req.body;
    mysqlConnection.query(
      "INSERT INTO ledger_master (ledger_name, ledger_type,status) VALUES (?, ?, ?)",
      [ledger_name, ledger_type,status],
      (err, result) => {
        if (err) {
          console.log(err)
          let response = {
            "status": APIResponse.ServerError,
            message: "Error creating ledger"
           }
       
           res.send(response);
        } else {
          let response = {
            "status": APIResponse.Success,
            message: "Ledger created successfully"
           }
        
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
