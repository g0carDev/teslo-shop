
export interface DashboardSummaryResponse {
    numberOfOrders:          number;
    numberOfProducts:        number;
    numberOfClients:         number;
    paidOrders:              number;
    notPaidOrders:           number;
    lowInventory:            number;
    productsWithNoInventory: number;
}
