const express = require("express");
const router = express.Router();

// Index - 
router.get("/",(req,res)=>{
    res.send("GET for posts");
});

// Show - 
router.get("/:id",(req,res)=>{
    res.send("GET for show posts");
});

// POST -
router.post("/",(req,res)=>{
    res.send("GET for posts")
});

//DELETE
router.delete("/:id",(req,res)=>{
    res.send("DELETE for posts id");
});

module.exports = router;
