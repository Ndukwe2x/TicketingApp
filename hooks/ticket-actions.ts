const printTicket = ({ ticketID }: { ticketID: string }) => {
    
    console.log('Printing ticket');
}

const sendTicketToCustomer = ( ticketID: string, customerEmail: string, customerPhone: string ) => {
    console.log('Sending ticket to customer...')
}

const markTicketAsAdmitted = ( ticketID: string ) => {
    console.log('Marking ticket as admitted...')
}

const suspendTicket = ( ticketID: string ) => {
    console.log('Suspending ticketing...')
}

const deleteTicket = ( ticketID: string ) => {
    console.log('Deleting ticket...')
}

export {
    printTicket,
    sendTicketToCustomer,
    markTicketAsAdmitted,
    suspendTicket,
    deleteTicket
}