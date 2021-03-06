import {
    web3Loaded,
    web3AccountLoaded,  
    tokenLoaded, 
    exchangeLoaded, 
    cancelledOrdersLoaded,
    allOrdersLoaded,
    filledOrdersLoaded
} from './actions'
import Web3 from "web3";
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'

export const loadWeb3 = async (dispatch) => {
  if(typeof window.ethereum !== 'undefined'){
    const web3 = new Web3(window.ethereum);
    dispatch(web3Loaded(web3))
    return web3
  } else {
    window.alert('Please install MetaMask')
    window.location.assign("https://metamask.io/")
  }
}

export const loadAccount = async (web3, dispatch) => {
    const webthree = new Web3(window.ethereum);
    const accounts = await webthree.eth.getAccounts()
    const account = await accounts[0] 
    if (typeof account !== 'undefined') {
        dispatch(web3AccountLoaded(account))
        return account
    } else {
        window.alert('Please login with MetaMask')
        return null
    }
}

export const loadToken = async (web3, networkId, dispatch) => {
  try {
    const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
    dispatch(tokenLoaded(token))
    return token
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const loadExchange = async (web3, networkId, dispatch) => {
  try {
    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
    console.log(exchange)
    dispatch(exchangeLoaded(exchange))
    return exchange
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const loadAllOrders = async (exchange, dispatch) => {
    // fetch cancelled orders with the "cancel" event stream"
    const cancelStream = await exchange.getPastEvents('Cancel', {fromBlock: 0, toBlock: 'latest'})
    const cancelledOrders = cancelStream.map((event) => event.returnValues)

    console.log(cancelledOrders)
    // add cancelled orders to the redux store
    dispatch(cancelledOrdersLoaded(cancelledOrders))

    // fetch filled orders with the "fill" event stream"
    const tradeStream = await exchange.getPastEvents('Trade', {fromBlock: 0, toBlock: 'latest'})
    const filledOrders = tradeStream.map((event) => event.returnValues)

    dispatch(filledOrdersLoaded(filledOrders))


    // fetch all orders with the "order" event stream"
    const orderStream = await exchange.getPastEvents('Order', {fromBlock: 0, toBlock: 'latest'})
    const allOrders = orderStream.map((event) => event.returnValues)

    dispatch(allOrdersLoaded(allOrders))
}