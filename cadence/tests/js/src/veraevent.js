import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";

import { getAdminAddress } from "./common";

/*
* Deploys VeraEvent contract to Admin.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const deployVeraEvents = async () => {
    const Admin = await getAdminAddress();
    await mintFlow(Admin, "10.0");

    return deployContractByName({ to: Admin, name: "VeraEvent" });
};

/*
* Creates a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraEventsCount = async () => {
    const name = "veraevent/get_count";

	return executeScript({ name });
};

/*
* Creates a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const createVeraEvent = async (type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata) => {
    const Admin = await getAdminAddress();
    const name = "veraevent/create_event";
    const args = [type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata];
	const signers = [Admin];

    return sendTransaction({ name, args, signers });
};

/*
* Get a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraEvent = async (eventId) => {
    const name = "veraevent/get_event";
    const args = [eventId]
	return executeScript({ name, args });
};

/*
* Get Metadata of a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getMetaData = async (eventId) => {
    const name = "veraevent/get_metadata";
    const args = [eventId]
	return executeScript({ name, args });
};

/*
* Get Metadata of a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getEventTier = async (eventId, tierId) => {
    const name = "veraevent/get_event_tier";
    const args = [eventId, tierId]
	return executeScript({ name, args });
};

/*
* Get Metadata of a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getEventSubTier = async (eventId, tierId, subtierId) => {
    const name = "veraevent/get_event_subtier";
    const args = [eventId, tierId, subtierId]
	return executeScript({ name, args });
};

/*
* Updates a VeraEvent
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const updateVeraEvent = async (eventId, type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata) => {
    const Admin = await getAdminAddress();
    const name = "veraevent/update_event";
    const args = [eventId, type, maxTickets, buyLimit, tier, subtier, defaultRoyaltyAddress, defaultRoyaltyPercent, royalties, eventURI, metadata];
	const signers = [Admin];

    return sendTransaction({ name, args, signers });
};

/*
* Get Total VeraEvents
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getTotalVeraEvents = async () => {
    const name = "veraevent/get_event_count";
	return executeScript({ name });
};