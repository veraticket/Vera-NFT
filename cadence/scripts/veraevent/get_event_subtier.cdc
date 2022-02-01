import VeraEvent from "../../contracts/VeraEvent.cdc"

pub fun main(eventId: UInt64, tierId: UInt64, subtierId: UInt64): VeraEvent.SubTier {
    let event:VeraEvent.EventStruct = VeraEvent.getEvent(id: eventId)
    return event.getSubTier(tier: tierId, subtier: subtierId)
}