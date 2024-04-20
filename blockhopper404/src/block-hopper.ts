import { Bytes, log } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll as ApprovalForAllEvent,
  ERC20Approval as ERC20ApprovalEvent,
  ERC20Transfer as ERC20TransferEvent,
  ERC721Approval as ERC721ApprovalEvent,
  ERC721Transfer as ERC721TransferEvent,
  ERC721TransferByCaller as ERC721TransferByCallerEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
  BlockHopper
} from "../generated/BlockHopper/BlockHopper"
import {
  ApprovalForAll,
  ERC20Approval,
  ERC20Transfer,
  ERC721Approval,
  ERC721Transfer,
  RaritySeedRemoved,
  RaritySeedSet,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/schema"
import { ADDRESS_ZERO } from "./constants"

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC20Approval(event: ERC20ApprovalEvent): void {
  let entity = new ERC20Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC20Transfer(event: ERC20TransferEvent): void {
  let entity = new ERC20Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC721Approval(event: ERC721ApprovalEvent): void {
  let entity = new ERC721Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.BlockHopper_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC721Transfer(event: ERC721TransferEvent): void {
  let entity = new ERC721Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.BlockHopper_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC721TransferByCaller(event: ERC721TransferByCallerEvent): void {
  let contract = BlockHopper.bind(event.address)
  let seed = contract.try_getRaritySeed(event.params.id)

  if(!seed.value) {
    log.error("Unable to get rarity seed for {}", [event.params.id.toString()])
    return;
  }
  
  if (event.params.from == Bytes.fromHexString(ADDRESS_ZERO)) {
    let seedSetEntity = new RaritySeedSet(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    seedSetEntity.caller = event.params.caller
    seedSetEntity.to = event.params.to
    seedSetEntity.BlockHopper_id = event.params.id
    seedSetEntity.seed = seed.value
  
    seedSetEntity.blockNumber = event.block.number
    seedSetEntity.blockTimestamp = event.block.timestamp
    seedSetEntity.transactionHash = event.transaction.hash
  
    seedSetEntity.save()
  } else if(event.params.to == Bytes.fromHexString(ADDRESS_ZERO)) {
    let seedRemovedEntity = new RaritySeedRemoved(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    seedRemovedEntity.caller = event.params.caller
    seedRemovedEntity.from = event.params.from
    seedRemovedEntity.BlockHopper_id = event.params.id
    seedRemovedEntity.seed = seed.value
  
    seedRemovedEntity.blockNumber = event.block.number
    seedRemovedEntity.blockTimestamp = event.block.timestamp
    seedRemovedEntity.transactionHash = event.transaction.hash
  
    seedRemovedEntity.save()
  }
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.BlockHopper_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
