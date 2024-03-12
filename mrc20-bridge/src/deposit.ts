import {
  Deposit as DepositEvent,
  MRC20Bridge
} from "../generated/MRC20Bridge/MRC20Bridge"
import {  BridgeEntity } from "../generated/schema"


export function setDeposit(
  event: DepositEvent
):void{
    let contract = MRC20Bridge.bind(event.address)

    let tx = contract.try_getTx(event.params.txId)

    let entity = new BridgeEntity(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.blockNo = event.block.number
    entity.txHash = event.transaction.hash
    entity.blockHash = event.block.hash
    entity.time = event.block.timestamp
    entity.txId = event.params.txId

    let tokenAddress = contract.try_tokens(tx.value.value1)

    entity.tokenId = tx.value.value1
    entity.amount = tx.value.value2
    entity.fromChain=tx.value.value3
    entity.toChain = tx.value.value4
    entity.user = tx.value.value5
    entity.tokenAddress = tokenAddress.value
    entity.deposited = true
    entity.claimed = false
    entity.save()
}