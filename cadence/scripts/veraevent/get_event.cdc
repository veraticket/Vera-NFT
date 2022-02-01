import VeraEvent from "../../contracts/VeraEvent.cdc"

pub fun main(eventId: UInt64): VeraEvent.EventStruct {
    return VeraEvent.getEvent(id: eventId)
}