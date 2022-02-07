import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import VeraEvent from "../../contracts/VeraEvent.cdc"
import VeraTicket from "../../contracts/VeraTicket.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, eventID: UInt64, nfts: { UInt64: { String: UInt64 } }, nftsURL: { UInt64: String }, gatickets: UInt64, astickets: UInt64) {
    
    // local variable for storing the minter reference
    let minter: &VeraTicket.NFTMinter

    // Variable to hold event collection
    let collection: &VeraEvent.EventCollection
    
    // Variable to hold event
    let event: VeraEvent.EventStruct

    var tickets: [VeraTicket.NFTStruct]

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&VeraTicket.NFTMinter>(from: VeraTicket.VeraMinterStorage)
            ?? panic("Could not borrow a reference to the NFT minter")
        
        // get the Event for which the Ticket is to be minted
        // get the Event for which the Ticket is to be minted
        self.collection = signer.borrow<&VeraEvent.EventCollection>(from: VeraEvent.VeraEventStorage)
            ?? panic("Could not borrow a reference to the owner's collection")  
  
        self.event = self.collection.getEvent(eventId: eventID)
        self.tickets = []

        for key in nfts.keys {
            var type: VeraTicket.NFTType = VeraTicket.NFTType.AssignedSeating
            var nftTier: UInt64 = 0
            var nftSubTier: UInt64 = 0
            for akey in nfts[key]!.keys {
                if akey == "type" {
                    if nfts[key]![akey]! == 0 {
                        type = VeraTicket.NFTType.GeneralAdmission
                    } else {
                        type = VeraTicket.NFTType.AssignedSeating
                    }
                }
                if akey == "tier" {
                    nftTier = nfts[key]![akey]!
                }
                if akey == "subtier" {
                    nftSubTier = nfts[key]![akey]!
                }
            }
            self.tickets.append(VeraTicket.NFTStruct(eventID: eventID, type: type, tier: nftTier, subtier: nftSubTier, tokenURI: nftsURL[key]!))
        }
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
        self.minter.mintMultipleNFT(recipient: receiver, eventID: eventID, tickets: self.tickets, gatickets: gatickets, astickets: astickets)
    }
}
