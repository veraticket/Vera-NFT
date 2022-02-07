import VeraEvent from "../../contracts/VeraEvent.cdc"

transaction (type: String, maxTickets: UInt64, buyLimit: UInt64, tier: [{String: UInt64}], subtier: [{String: UInt64}], defaultRoyaltyAddress: Address, defaultRoyaltyPercent: UFix64, royalties:{UInt64:{Address:UFix64}}, eventURI: String, metadata: {String: String}) {

    let eventAdmin: &VeraEvent.EventAdmin

    let eventType: VeraEvent.EventType

    let royalty: VeraEvent.Royalty

    let royaltyType: VeraEvent.RoyaltyType

    let accountRoyalty: { UInt64: VeraEvent.AccountRoyalty }

    let tier: { UInt64 : VeraEvent.Tier }
    
    let subtier: { UInt64 : VeraEvent.SubTier }

    prepare(signer: AuthAccount) {

        self.eventAdmin = signer
        .borrow<&VeraEvent.EventAdmin>(from: VeraEvent.VeraAdminStorage)
        ?? panic("Signer is not the vera event admin")
        self.royaltyType = VeraEvent.RoyaltyType.Percent
        self.royalty = VeraEvent.Royalty(id: 1, type: self.royaltyType, value: 20)
        
        var eventType: VeraEvent.EventType = VeraEvent.EventType.Public;

        if type == "public" {
            eventType = VeraEvent.EventType.Public
        } else if type == "private" {
            eventType = VeraEvent.EventType.Private
        }

        var tierName: String = "";
        var tierId: UInt64 = 0;
        var tierMaxTickets: UInt64 = 0;
        var tierType: VeraEvent.TierType = VeraEvent.TierType.GeneralAdmission;
        var tierCost: UFix64 = 0.0;
        var tiers: { UInt64 : VeraEvent.Tier } = {};
        var subtierTier: UInt64 = 0;
        var subtierName: String = "";
        var subtierId: UInt64 = 0;
        var subtierMaxTickets: UInt64 = 0;
        var subtierCost: UFix64 = 0.0;
        var subtiers: { UInt64 : VeraEvent.SubTier } = {};
        var accountRoyalty: { UInt64: VeraEvent.AccountRoyalty } = {};

        for t in tier {
            var i = 1;
            for key in t.keys {
                if (i == 1) {
                    tierName = key
                    tierId = t[key]!
                } else if (i == 2) {
                    tierMaxTickets = t[key]!
                } else if (i == 3) {
                    tierType = t[key]! == 0 ? VeraEvent.TierType.GeneralAdmission : VeraEvent.TierType.AssignedSeating
                } else if (i == 4) {
                    tierCost = 400.00
                }
                i = i + 1 
            }
            for st in subtier {
                var j = 1;
                for key in st.keys {
                    if (j == 1) {
                        subtierTier = st[key]!
                    } else if (j == 2) {
                        subtierName = key
                        subtierId = st[key]!
                    } else if (j == 3) {
                        subtierMaxTickets = st[key]!
                    } else if (j == 4) {
                        subtierCost = 400.00
                    }
                    j = j + 1 
                }
                if (tierId == subtierId) {
                    subtiers[subtierId] = VeraEvent.SubTier(id: subtierId, name: subtierName, cost: subtierCost, maxTickets: subtierMaxTickets)
                }
            }
            tiers[tierId] = VeraEvent.Tier(id: tierId, type: tierType, name: tierName, cost: tierCost, maxTickets: tierMaxTickets, subtier: subtiers)
        }

        for key in royalties.keys {
          for akey in royalties[key]!.keys {
            accountRoyalty[key] = VeraEvent.AccountRoyalty(id: key, account: akey, royaltyValue: royalties[key]![akey]!)
          }
        }

        self.tier = tiers

        self.subtier = subtiers

        self.accountRoyalty = accountRoyalty

        self.eventType = eventType;
    }

    execute {
        // Get the stored Minter reference for account
        self.eventAdmin.createEvent(type: self.eventType, tier: self.tier, maxTickets: maxTickets, buyLimit: buyLimit, defaultRoyaltyAddress: defaultRoyaltyAddress, defaultRoyaltyPercent: defaultRoyaltyPercent, royalty: self.royalty, royalties: self.accountRoyalty, eventURI: eventURI, metadata: metadata)

        log("Event Created!")
    }
}