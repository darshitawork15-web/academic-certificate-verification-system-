
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ethers } = require("ethers");

const Certificate = require("./models/Certificate");
const contractConfig = require("../shared/contractConfig.json");

const app = express();

app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(
    "https://ethereum-sepolia-rpc.publicnode.com"
);

const contract = new ethers.Contract(
    contractConfig.address,
    contractConfig.abi,
    provider
);

mongoose.connect("mongodb://127.0.0.1:27017/certificateDB")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(error => console.log("MongoDB connection error:", error));

app.get("/", (req, res) => {
    res.send("Certificate Verification Backend is running!");
});

app.get("/certificates", async (req, res) => {
    try {
        res.json(await Certificate.find());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/certificates", async (req, res) => {
    try {
        const saved = await new Certificate(req.body).save();
        res.status(201).json({
            message: "Certificate added successfully",
            certificate: saved
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REAL BLOCKCHAIN VERIFICATION
app.get("/verify/:certificateId/:hash", async (req, res) => {
    try {
        const { certificateId, hash } = req.params;

        if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
            return res.status(400).json({
                valid: false,
                message: "Invalid certificate hash format"
            });
        }

        const valid = await contract.verifyCertificate(
            certificateId,
            hash
        );

        const record = await contract.certificates(certificateId);

        res.json({
            certificateId,
            valid,
            issuer: record.issuer,
            issueDate: record.issueDate.toString(),
            message: valid
                ? "Certificate verified on Sepolia blockchain"
                : "Certificate is invalid or does not match"
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: "Blockchain verification failed",
            error: error.message
        });
    }
});

app.get("/certificates/:certificateId", async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId
        });

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate not found",
                valid: false
            });
        }

        res.json({
            message: "Certificate found",
            valid: certificate.status === "Valid",
            certificate
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/certificates/:certificateId/verify", async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            certificateId: req.params.certificateId
        });

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: "Certificate not found in database"
            });
        }

        const valid = await contract.verifyCertificate(
            certificate.certificateId,
            certificate.certificateHash
        );

        res.json({
            certificateId: certificate.certificateId,
            valid,
            message: valid
                ? "Certificate verified successfully on blockchain"
                : "Certificate is not valid on blockchain"
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
    console.log("Sepolia contract:", contractConfig.address);
});
