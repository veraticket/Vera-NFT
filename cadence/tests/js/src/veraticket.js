import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";

import { getAdminAddress } from "./common";

/*
* Deploys VeraTicket contract to Admin.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const deployVeraTicket = async () => {
    const Admin = await getAdminAddress();
    await mintFlow(Admin, "10.0");

    await deployContractByName({ to: Admin, name: "VeraEvent" });
    await deployContractByName({ to: Admin, name: "NonFungibleToken" });

	const addressMap = { NonFungibleToken: Admin, VeraEvent: Admin };

    return deployContractByName({ to: Admin, name: "VeraTicket", addressMap });
};

/*
* Enable VeraTicket Token to Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const enableVeraTicket = async (address) => {
    const Admin = await getAdminAddress();
    const name = "veraticket/setup_account";
    const args = [address];
	const signers = [Admin];
	return sendTransaction({ name, args, signers });    
};

/*
* Setup VeraTicket Token for Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const setupVeraTicketOnAccount = async (account) => {
    const name = "veraticket/setup_account";
    const signers = [account];
	return sendTransaction({ name, signers });    
};

/*
* Mint VeraTicket Token to Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const mintVeraTicket = async (account, eventId, type, tier, subtier, tokenURI) => {
    const Admin = await getAdminAddress();
    const name = "veraticket/mint_ticket";
    const args = [account, eventId, type, tier, subtier, tokenURI];
	const signers = [Admin];
    return sendTransaction({ name, args, signers });    
};

/*
* Mint Multiple VeraTicket Token to Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const mintMultipleVeraTicket = async (account, eventId, nfts, nftsURL, gatickets, astickets) => {
    const Admin = await getAdminAddress();
    const name = "veraticket/mint_multi_ticket";
    const args = [account, eventId, nfts, nftsURL, gatickets, astickets];
	const signers = [Admin];
    return sendTransaction({ name, args, signers });
};

/*
* Transfer VeraTicket Token from one Address to Another Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const transferVeraTicket = async (fromAccount, toAccount, ticketId) => {
    const Admin = await getAdminAddress();
    const name = "veraticket/transfer_ticket";
    const args = [toAccount, ticketId];
	const signers = [fromAccount];
	return sendTransaction({ name, args, signers });
};

/*
* Destroy VeraTicket Token from an Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const destroyVeraTicket = async (address, eventId, tier, subtier, ticketId) => {
    const Admin = await getAdminAddress();
    const name = "veraticket/destroy_ticket";
    const args = [address, eventId, tier, subtier, ticketId];
	const signers = [Admin];
	return sendTransaction({ name, args, signers });
};

/*
* Get VeraTicket Ids for an Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraTicketIds = async (account) => {
    const name = "veraticket/get_collection_ids";
	const args = [account]
    return executeScript({ name, args });
};

/*
* Get VeraTicket Count for an Address.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraTicketCount = async (account) => {
    const name = "veraticket/get_collection_length";
	const args = [account]
    return executeScript({ name, args });
};

/*
* Get Total VeraTicket Minted.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraTicketSupply = async () => {
    const name = "veraticket/get_veraticket_supply";
	return executeScript({ name });
};

/*
* Get VeraTicket.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraTicket = async (account, ticketId) => {
    const name = "veraticket/get_veraticket";
	const args = [account, ticketId];
	return executeScript({ name, args });
};

/*
* Get VeraTicket.
* @throws Will throw an error if transaction is reverted.
* @returns {Promise<*>}
* */
export const getVeraTicketType = async (account, ticketId) => {
    const name = "veraticket/get_veraticket_type";
	const args = [account, ticketId];
	return executeScript({ name, args });
};
