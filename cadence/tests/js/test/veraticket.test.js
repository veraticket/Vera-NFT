import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { getAdminAddress } from "../src/common";

import {
	deployVeraEvents,
	getVeraEvent,
	getVeraEventsCount,
	createVeraEvent,
    getMetaData,
	updateVeraEvent,
    getTotalVeraEvents,
    getEventTier
} from "../src/veraevent";

import {
    deployVeraTicket,
	setupVeraTicketOnAccount,
	getVeraTicketSupply,
	getVeraTicketCount,
	mintVeraTicket,
    getVeraTicket,
    getVeraTicketType,
    transferVeraTicket,
    destroyVeraTicket,
    mintMultipleVeraTicket
} from "../src/veraticket";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(100000);

describe("VeraTicket", () => {
    // Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7002;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

    it("shall deploy VeraTicket contract", async () => {
		await deployVeraTicket();
	});

	it("supply shall be 0 after contract is deployed", async () => {
		// Setup
		await deployVeraTicket();
		
		await shallResolve(async () => {
			const supply = await getVeraTicketSupply();
			expect(supply).toBe(0);
		});
	});

    it("shall be able to setup an account for VeraTicket", async () => {
		await deployVeraTicket();
		const Alice = await getAccountAddress("Alice");
		await shallPass(await setupVeraTicketOnAccount(Alice));

		// shall be able te read Alice collection and ensure it's empty
		await shallResolve(async () => {
			const itemCount = await getVeraTicketCount(Alice);
			expect(itemCount).toBe(0);
		});
    });

	it("shall be able to create a new empty Ticket Collection", async () => {
		// Setup
		await deployVeraTicket();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		// shall be able te read Alice collection and ensure it's empty
		await shallResolve(async () => {
			const itemCount = await getVeraTicketCount(Alice);
			expect(itemCount).toBe(0);
		});
	});
    
    it("shall be able to mint a VeraTicket", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));
    });

    it("shall not be able to mint more than max tickets for an Event", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 100,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 2;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
				
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Create another VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Should Fail on Third VeraTicket Creation
		await shallRevert(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));
    });

    it("shall not be able to mint more than max tickets of Tier for an Event", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 2,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 100,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
				
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Create another VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Should Fail on Third VeraTicket Creation
		await shallRevert(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));
    });

    it("shall not be able to mint more than max tickets of Sub Tier for an Event", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 2,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
				
		// Setup
        const eventId = 0;
        const nftType = 1;
        const nfttier = 1;
        const nftsubtier = 1;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Create another VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Should Fail on Third VeraTicket Creation
		await shallRevert(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));
    });
/*
    it("shall not be able to mint more than buy limit for an Event", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 2;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
				
		// Setup
        const eventId = 0;
        const nftType = 1;
        const nfttier = 1;
        const nftsubtier = 1;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Create another VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Should Fail on Third VeraTicket Creation
		await shallRevert(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));
    });
*/

    it("shall be able to mint multiple VeraTickets", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
                "Tier 1": 1,
                "maxTickets": 200,
                "type": 0,
                "cost": 400
            },
            {
                "Tier 2": 2,
                "maxTickets": 200,
                "type": 0,
                "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
        await shallResolve(async () => {
			const event = await getVeraEvent(0);
            // console.log(event)
		});

		// Setup
        const eventId = 0;
        
        const nfts = [
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            }
        ];

        const nftsURL = {
            "0": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "1": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68"
        };
        		
		// Create VeraTicket
		await shallPass(mintMultipleVeraTicket(Alice, eventId, nfts, nftsURL, 2, 0));
    });

    it("shall not be able to mint multiple VeraTickets more than max tickets", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "type": 0,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 100,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 2;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
        const eventId = 0;
        
        const nfts = [
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            }
        ];

        const nftsURL = {
            "0": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "1": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "2": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68"
        };
		
		// Create VeraTicket
		await shallRevert(mintMultipleVeraTicket(Alice, eventId, nfts, nftsURL, 3, 0));

    });

    it("shall not be able to mint multiple VeraTickets more than max tickets of tier", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "type": 0,
            "maxTickets": 2,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 100,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
        // Setup
		const eventId = 0;
        
        const nfts = [
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            }
        ];

        const nftsURL = {
            "0": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "1": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "2": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68"
        };
		
		// Create VeraTicket
		await shallRevert(mintMultipleVeraTicket(Alice, eventId, nfts, nftsURL, 3, 0));
    });
/*
    it("shall not be able to mint multiple VeraTickets more than Buy Limit", async () => {
		// Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 2;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
		const eventId = 0;
        
        const nfts = [
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            },
            {
                "type": 0,
                "tier": 1,
                "subtier": 0
            }
        ];

        const nftsURL = {
            "0": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "1": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68",
            "2": "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68"
        };
		
		// Create VeraTicket
		await shallRevert(mintMultipleVeraTicket(Alice, eventId, nfts, nftsURL, 3, 0));
    });
*/
    it("shall be able to get a VeraTicket for an Event", async () => {
        // Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Shall be able to get the Ticket from the Alice's Collection
        await shallResolve(async () => {
            const ticket = await getVeraTicket(Alice, 0);
            expect(ticket.id).toBe(0);
			expect(ticket.eventID).toBe(0);
            expect(ticket.tier).toBe(1);
            expect(ticket.subtier).toBe(0);
			expect(ticket.tokenURI).toBe("https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68");
        });
    });

    it("shall be able to get a VeraTicket Type", async () => {
        // Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Shall be able to get the Ticket from the Alice's Collection
        await shallResolve(async () => {
            const ticketType = await getVeraTicketType(Alice, 0);
        });
    });

    it("shall be able to transfer a VeraTicket for an Event", async () => {
        // Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);
        const Bob = await getAccountAddress("Bob");
		await setupVeraTicketOnAccount(Bob);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Shall be able to get the Ticket from the Alice's Collection
        await shallResolve(async () => {
            const ticket = await getVeraTicket(Alice, 0);
            expect(ticket.id).toBe(0);
			expect(ticket.eventID).toBe(0);
            expect(ticket.tier).toBe(1);
            expect(ticket.subtier).toBe(0);
			expect(ticket.tokenURI).toBe("https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68");
        });

        await shallPass(transferVeraTicket(Alice, Bob, 0))

        // Shall be able to get the Ticket from the Alice's Collection
        await shallResolve(async () => {
            const ticket = await getVeraTicket(Bob, 0);
            expect(ticket.id).toBe(0);
			expect(ticket.eventID).toBe(0);
            expect(ticket.tier).toBe(1);
            expect(ticket.subtier).toBe(0);
			expect(ticket.tokenURI).toBe("https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68");
        });
    });

    it("shall be able to destroy the VeraTicket", async () => {
        // Setup
		await deployVeraTicket();
		const Admin = await getAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupVeraTicketOnAccount(Alice);

		const Ryan = await getAccountAddress("Ryan");

        const type = "public";

        const tier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const subtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const royalties = [1][Ryan]= 100.00
                
        const maxTickets = 200;

        const buyLimit = 200;

        const defaultRoyaltyAddress = Ryan;

        const defaultRoyaltyPercent = 20.0;

        const eventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP";
        
        const metadata = {
            "Test": "test"
        };
		
		// Create VeraEvent
		await shallPass(createVeraEvent(type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata));
		
		// Setup
        const eventId = 0;
        const nftType = 0;
        const nfttier = 1;
        const nftsubtier = 0;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68";
		
		// Create VeraTicket
		await shallPass(mintVeraTicket(Alice, eventId, nftType, nfttier, nftsubtier, tokenURI));

        // Shall be able to get the Ticket from the Alice's Collection
        await shallResolve(async () => {
            const ticket = await getVeraTicket(Alice, 0);
            expect(ticket.id).toBe(0);
			expect(ticket.eventID).toBe(0);
            expect(ticket.tier).toBe(1);
            expect(ticket.subtier).toBe(0);
			expect(ticket.tokenURI).toBe("https://gateway.pinata.cloud/ipfs/QmeetFbSKEXe6MFEaNeBHszsxRCWnv7SvdSzGi97cymo68");
        });

        await shallPass(destroyVeraTicket(Alice, 0, 1, 0, 0))

        // Shall not be able to get the Ticket from the Alice's Collection
        await shallResolve(async () => {
            const ticket = await getVeraTicket(Alice, 0);
            expect(ticket).toBe(null);
        });
    });
});