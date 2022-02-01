import VeraEvent from "../../contracts/VeraEvent.cdc"

pub fun main(): UInt64 {
    return VeraEvent.totalEvents
}