import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { getAdminAddress } from "../src/common";

import {
	deployVeraEvents,
	getVeraEvent,
	getVeraEventsCount,
	createVeraEvent,
    getMetaData,
    getEventTier,
    getEventSubTier,
	updateVeraEvent,
    getTotalVeraEvents
} from "../src/veraevent";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(100000);

describe("Vera Events", () => {
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

    it("shall deploy VeraEvent contract", async () => {
		await deployVeraEvents();
	});

	it("count shall be 0 after contract is deployed", async () => {
		// Setup
		await deployVeraEvents();
		
        await shallResolve(async () => {
			const count = await getVeraEventsCount();
			expect(count).toBe(0);
		});
	});

    it("shall be able to create a VeraEvent", async () => {
		// Setup
		await deployVeraEvents();
        
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
    });
   
    it("shall be able to get a VeraEvent", async () => {
		// Setup
		await deployVeraEvents();
        
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


		await shallResolve(async () => {
			const event = await getVeraEvent(0);
			expect(event.id).toBe(0);
            expect(event.maxTickets).toBe(200);
            expect(event.defaultRoyaltyAddress).toBe(Ryan);
            expect(event.defaultRoyaltyPercent).toBe("20.00000000");
			expect(event.eventURI).toBe("https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP");
		});
	});

    it("shall be able to get MetaData of VeraEvent", async () => {
		// Setup
		await deployVeraEvents();
        
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

        await shallResolve(async () => {
			const metadata = await getMetaData(0);
			expect(metadata).toStrictEqual({
				"Test": "test"
			});
		});
	});

    it("shall be able to get Tier of VeraEvent", async () => {
		// Setup
		await deployVeraEvents();
        
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

        await shallResolve(async () => {
			const tier = await getEventTier(0, 1);
		});
	});

    it("shall be able to get Sub Tier of VeraEvent", async () => {
		// Setup
		await deployVeraEvents();
        
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

        await shallResolve(async () => {
			const subtier = await getEventSubTier(0, 1, 1);
		});
	});

    it("shall be able to update an Event", async () => {
		// Setup
		await deployVeraEvents();

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

        await shallResolve(async () => {
			const event = await getVeraEvent(0);
			expect(event.id).toBe(0);
            expect(event.maxTickets).toBe(200);
            expect(event.defaultRoyaltyAddress).toBe(Ryan);
            expect(event.defaultRoyaltyPercent).toBe("20.00000000");
			expect(event.eventURI).toBe("https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeP");
		});
		
        const eventId = 0;

        const Mike = await getAccountAddress("Mike");

        const utype = "private";

        const utier = [
            {
            "Tier 1": 1,
            "maxTickets": 200,
            "cost": 400
            }
        ];

        const usubtier = [
            {
                "Tier 1": 1,
                "SubTier 1": 1,
                "maxTickets": 200,
                "cost": 400
            }
        ];

        const uroyalties = [1][Mike] = 100.00

        const udefaultRoyaltyAddress = Mike;

        const udefaultRoyaltyPercent = 25.0;
        
        const umaxTickets = 400;

        const ubuyLimit = 40;

        const ueventURI = "https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeA";

        const umetadata = {
            "Test": "test"
        };

        // Update VeraEvent
		await shallPass(updateVeraEvent(eventId, utype, umaxTickets, ubuyLimit, utier, usubtier, udefaultRoyaltyAddress, udefaultRoyaltyPercent, uroyalties, ueventURI, umetadata));

		// shall be able te read VeraEvent and be able to Verify the Data
		await shallResolve(async () => {
			const event = await getVeraEvent(0);
			expect(event.id).toBe(0);
            expect(event.maxTickets).toBe(400);
            expect(event.defaultRoyaltyAddress).toBe(Mike);
            expect(event.defaultRoyaltyPercent).toBe("25.00000000");
			expect(event.eventURI).toBe("https://gateway.pinata.cloud/ipfs/QmNk4E3dfhfAYAcQc6CqFCdGMg1xsAhKZGMdr5MS5AAUeA");
		});
	});

    it("shall be able to get the total Vera Events Created", async () => {
		// Setup
		await deployVeraEvents();
		
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

        await shallResolve(async () => {
			const count = await getTotalVeraEvents();
			expect(count).toBe(1);
		});
	})
});
