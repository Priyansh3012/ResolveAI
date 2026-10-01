const Ticket = require("./ticketModel");

// Create a new ticket
const createTicket = async (data) => {
    const ticket = await Ticket.create(data);

    return ticket;
};

module.exports = {
    createTicket
};