// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateVerification {

    struct Certificate {
        string certificateId;
        bytes32 certificateHash;
        address issuer;
        uint256 issueDate;
        bool isValid;
    }

    address public institution;

    mapping(string => Certificate) public certificates;

    event CertificateIssued(
        string certificateId,
        bytes32 certificateHash,
        address issuer,
        uint256 issueDate
    );

    constructor() {
        institution = msg.sender;
    }

    function issueCertificate(
        string memory _certificateId,
        bytes32 _certificateHash
    ) public {
        require(msg.sender == institution, "Not authorized to issue certificates");
        require(
            certificates[_certificateId].issueDate == 0,
            "Certificate already exists"
        );

        certificates[_certificateId] = Certificate(
            _certificateId,
            _certificateHash,
            msg.sender,
            block.timestamp,
            true
        );

        emit CertificateIssued(_certificateId, _certificateHash, msg.sender, block.timestamp);
    }

    function verifyCertificate(
        string memory _certificateId,
        bytes32 _certificateHash
    ) public view returns (bool) {

        Certificate memory certificate = certificates[_certificateId];

        return (
            certificate.issueDate != 0 &&
            certificate.certificateHash == _certificateHash &&
            certificate.isValid
        );
    }
}