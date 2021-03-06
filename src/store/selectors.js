import {get} from 'lodash'
import { createSelector } from 'reselect'
import { ETHER_ADDRESS, tokens, ether} from '../helpers.js'

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const contractLoaded = state => tokenLoaded(state) && exchangeLoaded(state)
export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl,el) => (tl && el)
)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
    filledOrders,
    (orders) => {
        // decorate the order

        // sort orders by date descending for display
        orders = orders.sort((a, b) => b.timestamp - a.timestamp)
        console.log(orders)
    }
)

const decorateFilledOrders = (orders) => {
    return (
        orders.map((order) => {
        return order = decorateOrder(order)
        })
    )
}

let tokenPrice = (etherAmount/ tokenAmount)
const precision = 100000
tokenPrice = Math.round(tokenPrice * precision) / precision

const decorateOrder = (order) => {
    let etherAmount
    let tokenAmount

    if (order.tokenGive == ETHER_ADDRESS){
        etherAmount = order.amountGive
        tokenAmount = order.amountGet
    } else {
        etherAmount = order.amountGet
        tokenAmount = order.amountGive
    }
    return ({
        ...order,
        etherAmount: ether(etherAmount),
        tokenAmount: tokens(tokenAmount)
    })
}