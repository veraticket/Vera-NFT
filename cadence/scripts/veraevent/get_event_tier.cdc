import VeraEvent from "../../contracts/VeraEvent.cdc"

pub fun main(eventId: UInt64, tierId: UInt64): VeraEvent.Tier {
    let event:VeraEvent.EventStruct = VeraEvent.getEvent(id: eventId)
    return event.getTier(tier: tierId)
}