// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './token.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Exchange {
    using SafeMath for uint256;


    string public name = "Exchange";
    string public symbol = "LCA";
    string public standard = "Token v1.0.0";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    uint256 public feePercent;
    address public feeAccount;

    address constant ETHER = address(0); //store ether in tokens mapping with blank address
    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    fallback() external payable {
        revert();
    }

    function depositEther() payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

}

//to do

// deposit ether
// withdraw ether
// deposit ether
// deposit tokens
// check balance
// make order
//cancel order
// fill order
// charge fees