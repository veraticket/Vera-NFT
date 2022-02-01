import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

pub fun main(address: Address, ticketID: UInt64): VeraTicket.NFTType? {
  let collection = getAccount(address).getCapability<&VeraTicket.Collection{NonFungibleToken.CollectionPublic, VeraTicket.TicketsCollectionPublic}>(VeraTicket.CollectionPublicPath).borrow() ?? panic("Unable to get Collection Reference")
  if  collection != nil {
    if let item = collection.borrowTicket(id: ticketID) {
      return item.type
    }
    return nil
  }
  return nil
}