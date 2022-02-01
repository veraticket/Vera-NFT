#  Smart Contract Details

This is the Repository containing the contracts for the VeraEvent and their test cases. It is to verify the test cases for the contracts for the desired functionality.

This repository contains following 2 contracts

#### VeraEvent.cdc ####

1. VeraEvent.cdc

    1. **Path** : cadence/contracts/VeraEvent.cdc 
    2. **Objective** : The VeraEvent Contract to hold the Event Data on the Blockchain. This contract is to maintain the Collection of EventStruct which will hold the data related to Events.
    3. **Enums** :
        1. EventType : It have the cases for EventType which can be Public / Private
        2. TierType : It have the cases for TierType which can be GeneralAdmission / AssignedSeating
        3. RoyaltyType : It have the cases for RoyaltyType which can be Fixed / Percent
    4. **Structs** :
        1. Royalty: This is the struct for holding the Royalty related data
            * id : To hold the data for the Id
            * type : To hold the data for the type of Royalty (RoyaltyType Enum Value (Fixed / Percent))
            * value : To hold the value of the royalty
        2. AccountRoyalty: This is the struct for holding the Account for the Royalty
            * id : To hold the data for the Id
            * account : To hold the data for the Account for the Royalty (Address Type)
            * royaltyValue : To hold the percent value of the royalty for this account
        3. SubTier: This is the struct for holding the data related to the SubTier
            * id : To hold the data for the Id
            * name : To hold the name for the SubTier
            * cost : To hold the cost for Tickets of the SubTier
            * maxTickets : To hold the data for the maxTickets of the SubTier
            * ticketsMinted : To hold the data for the tickets minted of the SubTier
        4. Tier: This is the struct for holding the data related to the Tier
            * id : To hold the data for the Id
            * name : To hold the name for the Tier
            * cost : To hold the cost for Tickets of the Tier
            * maxTickets : To hold the data for the maxTickets of the Tier
            * ticketsMinted : To hold the data for the tickets minted of the Tier
            * subtier : To hold the data for the subtiers of the Tier (Dictionary Type)
        5. EventStruct: This is the struct for holding the data related to the Event
            * id : To hold the data for the Id of the Event
            * type : To hold the type of the Event (EventType Enum Value (Public / Private))
            * tier : To hold the data for the tiers of the Event (Dictionary Type)
            * maxTickets : To hold the data for the maxTickets of the Event
            * buyLimit : To hold the data for the per account ticket buy limit for the Event
            * defaultRoyaltyPercent : To hold the data for default Royalty Percent for an Event
            * defaultRoyaltyAddress : To hold the data for default Royalty Address for an Event (Event Organizer Address)
            * totalTicketsMinted : To hold the Total Tickets Minted for an Event
            * eventURI : To hold the IPFS URI for the Event Data (title, description etc.)
            * royalty : To hold the royalty related data for an Event ( Royalty Struct Type)
            * royalties : To hold the data royalty accounts for an Event (Dictionary of AccountRoyalty Type)
    5. **Collection holds an Dictionary of EventStruct and Event Metadata Objects**
    6. **Transactions**
        1. cadence/transactions/veraevent/create_event.cdc : To Create an Event
        2. cadence/transactions/veraevent/update_event.cdc : To Update an Event
    7. **Scripts**
        1. cadence/scripts/veraevent/get_count.cdc : To get the count of the Event
        2. cadence/scripts/veraevent/get_event_count.cdc : To get the count of the Event
        3. cadence/scripts/veraevent/get_event_subtier.cdc : To get the subtier of tier of the Event
        4. cadence/scripts/veraevent/get_event_tier.cdc : To get the tier of the Event
        5. cadence/scripts/veraevent/get_event.cdc : To get the Event Data
        6. cadence/scripts/veraevent/get_metadata.cdc : to get the Event Metadata
    8. **Functionalities achieved in this Contract**
        1. Create an Event
        2. Update an Event
        3. Get an Event
        4. Get Metadata of an Event
        5. Get the Ids of the Events in the Collection
    9. **Test Cases for Vera Event**
        1. shall deploy VeraEvent contract
        2. count shall be 1 after contract is deployed
        3. shall be able to create a VeraEvent
        4. shall be able to get a VeraEvent
        5. shall be able to get MetaData of a VeraEvent
        6. shall be able to get Tier of VeraEvent
        7. shall be able to get Sub Tier of VeraEvent
        8. shall be able to update an Event
        9. shall be able to get the total Vera Events Created

#### VeraTicket.cdc ####

2. VeraTicket.cdc

    1. **Path** : cadence/contracts/VeraTicket.cdc
    2. **Objective** : The VeraTicket Contract extends the NonFungibleToken Contract to hold the Ticket NFT Data on the Blockchain. This contract is to maintain the Collection of Tickets NFT which will hold the data related to Event Tickets.
    3. **Enums** :
        1. NFTType : It have the cases for NFTType which can be GeneralAdmission / AssignedSeating
    4. **Resources** :
        1. NFT: This is the resource for holding the NFT (Ticket) related data
            * id : To hold the data for the Id
            * eventID : To hold the data of event Id of the NFT
            * type : To hold the value of the NFT Type (NFTType enum value (GeneralAdmission / AssignedSeating))
            * tier : To hold the data of tier Id of the NFT
            * subtier : To hold the data of subtier Id of the NFT
            * tokenURI : To hold the IPFS URI for the NFT Ticket Data
    5. **Collection holds an Dictionary of NFTs Tickets Objects**
    6. **Transactions** :
        1. cadence/transactions/veraticket/setup_account.cdc : To setup a user account for Ticket NFT Collection
        2. cadence/transactions/veraticket/mint_ticket.cdc : To Mint a Ticket NFT
        3. cadence/transactions/veraticket/transfer_ticket.cdc : To Transfer a Ticket NFT
        4. cadence/transactions/veraticket/destroy_ticket.cdc : To Destroy a Ticket NFT
    7. **Scripts** :
        1. cadence/scripts/veraticket/get_collection_ids.cdc : To get the ids of the Ticket NFT Collection
        2. cadence/scripts/veraticket/get_collection_length.cdc : To get the length of the Ticket NFT Collection (Number of tickets in collection)
        3. cadence/scripts/veraticket/get_veraticket_supply.cdc : To get the Total Tickets minted till now
        4. cadence/scripts/veraticket/get_veraticket_type.cdc : To get the type of the Ticket (GeneralAdmission / AssignedSeating)
        5. cadence/scripts/veraticket/get_veraticket.cdc : To get the Ticket NFT Data 
    8. **Functionalities achieved in the Collection** :
        1. Withdraw NFT
        2. Deposit NFT
        3. Get Ids of NFT
        4. Borrow NFT
        5. Destroy the NFT
    9. **Functionalities achieved in this Contract** :
        1. Create an empty collection
        2. Mint an NFT
    10. **Test Cases for Vera Ticket**
        1. shall deploy VeraTicket contract
        2. supply shall be 1 after contract is deployed
        3. shall be able to setup an account for VeraTicket
        4. shall be able to create a new empty Ticket Collection
        5. shall be able to mint a VeraTicket
        6. shall not be able to mint more than max tickets
        7. shall not be able to mint more than max tickets of Tier for an Event
        8. shall not be able to mint more than max tickets of Sub Tier for an Event
        9. shall not be able to mint more than buy limit for an Event
        10. shall be able to get a VeraTicket
        11. shall be able to transfer a VeraTicket
        12. shall be able to destroy the VeraTicket


## Application Functionality that is to be Achieved

The Application to be built on these contracts need to achieve the following functionality :

* Organizers should be able to Create Event with the Admin FLOW Account
* Admin Account should be able to keep info related to royalty and tiers for the Event
* The IPFS link of data related to the event will be stored in the Event Structure in Event Contract
* Admin should be able to mint Ticket as NFT on the fly and Transfer to the User (recipient) Account
* Users Should be able to transfer the ticket to another User account
* There should be provision to destroy the Ticket in case for cancellation of Event

## Installation and Checking Test Cases

* You should have Node JS Installed
* You Should have FLOW CLI Installed
* You Should have flow.json file
* Go to the folder cadence/tests/js
* Execute the command **npm install**
* After Installation Execute the Command **npm run test**

**Create Event Flow**

![create event](/images/create_event.jpg)

**Disclaimer** : cadence/contracts/NonFungibleToken.cdc - The NonFungibleToken Contract to be deployed on the emulator as it is needed only on emulator