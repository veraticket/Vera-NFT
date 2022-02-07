import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraEvent from "../../contracts/VeraEvent.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, eventID: UInt64, type: UInt64, tier: UInt64, subtier: UInt64,tokenURI: String) {
    
    // local variable for storing the minter reference
    let minter: &VeraTicket.NFTMinter

    // Variable to hold event collection
    let collection: &VeraEvent.EventCollection
    
    // Variable to hold event
    let event: VeraEvent.EventStruct

    let type: VeraTicket.NFTType

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&VeraTicket.NFTMinter>(from: VeraTicket.VeraMinterStorage)
            ?? panic("Could not borrow a reference to the NFT minter")
        
        // get the Event for which the Ticket is to be minted
        // get the Event for which the Ticket is to be minted
        self.collection = signer.borrow<&VeraEvent.EventCollection>(from: VeraEvent.VeraEventStorage)
            ?? panic("Could not borrow a reference to the owner's collection")  
  
        self.event = self.collection.getEvent(eventId: eventID)

        self.type = type == 0 ? VeraTicket.NFTType.GeneralAdmission : VeraTicket.NFTType.AssignedSeating
    }

    execute {

        // get the public account object for the recipient
        let recipient = getAccount(recipient)

        // borrow the recipient's public NFT collection reference
        let receiver = recipient
            .getCapability(VeraTicket.VeraTicketPubStorage)!
            .borrow<&{NonFungibleToken.CollectionPublic, VeraTicket.TicketsCollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(recipient: receiver, eventID: eventID, type: self.type, tier: tier, subtier: subtier, tokenURI: tokenURI)

        // Increment the number of tickets minted
        self.collection.incrementTicketMinted(eventId: eventID, tier: tier, subtier: subtier)
    }
}
