import VeraEvent from "../../contracts/VeraEvent.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(eventID:UInt64, tier:UInt64, subtier: UInt64) {
    
    // Variable to hold event collection
    let collection: &VeraEvent.Collection
    
    prepare(signer: AuthAccount) {
        // get the Event for which the Ticket is to be minted
        self.collection = signer.borrow<&VeraEvent.Collection>(from: VeraEvent.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
    }

    execute {
        // Increment the number of tickets minted
        self.collection.decrementTicketMinted(eventId: eventID, tier: tier, subtier: subtier)
    }
}