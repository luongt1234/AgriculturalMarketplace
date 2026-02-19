export interface FarmingLog {
    id: string;
    timestamp: {
        date: string;
        time: string;
    };
    transactionType: {
        label: string;
        icon: string;
        colorClass: string;
    };
    blockHash: string;
    blockNumber: string;
    status: 'Confirmed' | 'Pending' | 'Failed';
}