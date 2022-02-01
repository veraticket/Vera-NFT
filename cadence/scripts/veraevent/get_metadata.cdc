import VeraEvent from "../../contracts/VeraEvent.cdc"

pub fun main(eventId: UInt64): { String : String } {
    return VeraEvent.getMetadata(id: eventId)
}