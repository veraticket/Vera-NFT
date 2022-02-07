import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

pub fun main(address: Address, ticketID: UInt64): &VeraTicket.NFT? {
  let collection = getAccount(address).getCapability<&VeraTicket.Collection{NonFungibleToken.CollectionPublic, VeraTicket.TicketsCollectionPublic}>(VeraTicket.VeraTicketPubStorage).borrow() ?? panic("Unable to get Collection Reference")
  if  collection != nil {
    if let item = collection.borrowTicket(id: ticketID) {
      return item
    }
    return nil
  }
  return nil
}