// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        // initial randomness
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public payable {
        // Exert 2 minutes delay
        require(
            lastWavedAt[msg.sender] + 2 minutes < block.timestamp,
            "Wait for 2 minutes to wave again!"
        );

        // Update user's timestamp
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // New randomness (seed)
        seed = (block.difficulty + block.timestamp + seed) % 100;

        // Set 50% chance that a user wins
        if (seed < 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Sorry, balance is low!"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function allWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
