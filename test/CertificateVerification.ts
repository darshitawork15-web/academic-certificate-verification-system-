import { network } from "hardhat";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("CertificateVerification", async function () {
    const { ethers } = await network.connect();

    async function deployContract() {
        const [institution, other] = await ethers.getSigners();
        const CertificateVerification = await ethers.getContractFactory(
            "CertificateVerification"
        );
        const contract = await CertificateVerification.deploy();
        await contract.waitForDeployment();
        return { contract, institution, other };
    }

    it("sets the deployer as the institution", async function () {
        const { contract, institution } = await deployContract();
        expect(await contract.institution()).to.equal(institution.address);
    });

    it("allows the institution to issue a certificate", async function () {
        const { contract } = await deployContract();
        const hash = ethers.keccak256(ethers.toUtf8Bytes("some certificate data"));

        await expect(contract.issueCertificate("CERT001", hash))
            .to.emit(contract, "CertificateIssued");

        const isValid = await contract.verifyCertificate("CERT001", hash);
        expect(isValid).to.equal(true);
    });

    it("rejects issuance from a non-institution wallet", async function () {
        const { contract, other } = await deployContract();
        const hash = ethers.keccak256(ethers.toUtf8Bytes("some certificate data"));

        await expect(
            contract.connect(other).issueCertificate("CERT002", hash)
        ).to.be.revertedWith("Not authorized to issue certificates");
    });

    it("rejects a duplicate certificate ID", async function () {
        const { contract } = await deployContract();
        const hash = ethers.keccak256(ethers.toUtf8Bytes("some certificate data"));

        await contract.issueCertificate("CERT003", hash);

        await expect(
            contract.issueCertificate("CERT003", hash)
        ).to.be.revertedWith("Certificate already exists");
    });

    it("returns false for a tampered hash", async function () {
        const { contract } = await deployContract();
        const originalHash = ethers.keccak256(ethers.toUtf8Bytes("original data"));
        const tamperedHash = ethers.keccak256(ethers.toUtf8Bytes("tampered data"));

        await contract.issueCertificate("CERT004", originalHash);

        const isValid = await contract.verifyCertificate("CERT004", tamperedHash);
        expect(isValid).to.equal(false);
    });

    it("returns false for a certificate that was never issued", async function () {
        const { contract } = await deployContract();
        const hash = ethers.keccak256(ethers.toUtf8Bytes("anything"));

        const isValid = await contract.verifyCertificate("DOES_NOT_EXIST", hash);
        expect(isValid).to.equal(false);
    });
});