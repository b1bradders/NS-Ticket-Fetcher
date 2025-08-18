export enum Status {
	SUCCESS = 'SUCCESS',
	OPEN = 'OPEN',
	FAILED = 'FAILED',
}

export interface PaymentResponse {
	status: Status;
}
export interface TicketResponse {
	initials: string;
	lastName: string;
	secutixMobilePDFLink: string;
}
export interface TicketAndPaymentResponse {
	payment: PaymentResponse;
	tickets: TicketResponse[];
	shareUrl: string;
	orderDetailId: string;
}
export interface OrderResponse {
	payload: TicketAndPaymentResponse;
}