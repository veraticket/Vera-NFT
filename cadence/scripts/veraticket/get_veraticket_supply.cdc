import VeraTicket from "../../contracts/VeraTicket.cdc"

// This scripts returns the number of VeraTicket currently in existence.

pub fun main(): UInt64 {    
    return VeraTicket.totalSupply
}