import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

// This transaction configures an account to hold Kitty Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&VeraTicket.Collection>(from: VeraTicket.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- VeraTicket.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: VeraTicket.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&VeraTicket.Collection{NonFungibleToken.CollectionPublic, VeraTicket.TicketsCollectionPublic}>(VeraTicket.CollectionPublicPath, target: VeraTicket.CollectionStoragePath)
        }
    }
}