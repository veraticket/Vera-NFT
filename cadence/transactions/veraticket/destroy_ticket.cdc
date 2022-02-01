import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraEvent from "../../contracts/VeraEvent.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(address: Address, eventID:UInt64, tier:UInt64, subtier: UInt64, ticketID: UInt64) {
    
    prepare(signer: AuthAccount) {
 
    }

    execute {
        // get the public account object for the recipient
        let account = getAccount(address)

        let collection = getAccount(address).getCapability<&VeraTicket.Collection{NonFungibleToken.CollectionPublic, VeraTicket.TicketsCollectionPublic}>(VeraTicket.CollectionPublicPath).borrow() ?? panic("Unable to get Collection Reference")
        if  collection != nil {
            if let item = collection.borrowTicket(id: ticketID) {
                if (item.eventID == eventID && item.tier == tier && item.subtier == subtier) {
                    collection.destroyTicket(eventID: eventID, id: ticketID, tier: tier, subtier: subtier)
                }
            }
        }
    }
}