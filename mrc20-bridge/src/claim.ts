import { BridgeEntity } from '../generated/schema'
import {
      Claim as ClaimEvent,
      MRC20Bridge
} from "../generated/MRC20Bridge/MRC20Bridge"



export function setClaim(event: ClaimEvent):void{
      let contract = MRC20Bridge.bind(event.address)

      let entity =  new BridgeEntity(
            event.transaction.hash.concatI32(event.logIndex.toI32())
      )

      let tokenAddress = contract.try_tokens(event.params.tokenId)

      entity.blockNo = event.block.number
      entity.txHash = event.transaction.hash
      entity.blockHash = event.block.hash
      entity.time = event.block.timestamp
      entity.txId = event.params.txId
      entity.tokenId = event.params.tokenId
      entity.fromChain = event.params.fromChain
      entity.user = event.params.user
      entity.amount = event.params.amount
      entity.tokenAddress = tokenAddress.value
      entity.deposited = false
      entity.claimed = true
      entity.save()

}