import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

// This script returns the size of an account's VeraTicket collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(VeraTicket.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}