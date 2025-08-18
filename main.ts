import {API_ORDER_FETCH, API_SHARE_URL, SUB_KEY} from "./consts.ts";
import {sprintf} from "@std/fmt/printf";
import {OrderResponse, TicketAndPaymentResponse} from "./models.ts";

async function getFetch(url: string): Promise<Response> {
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'ocp-apim-subscription-key': SUB_KEY, // this is the subscription key used by the app
		},
		redirect: 'manual'
	});
}

if (import.meta.main) {
	const shareCode: string = (Deno.args)[0];
	if(!shareCode || shareCode.length < 8) {
		console.error("Share code not provided, or invalid.")
		Deno.exit(2);
	}

	const shareCodeResponse = await getFetch(sprintf(API_SHARE_URL, shareCode));
	if (!shareCodeResponse.ok && shareCodeResponse.status !== 302) {
		console.error(`Error fetching from shareCode URL: ${shareCodeResponse.status} ${shareCodeResponse.statusText}`);
		Deno.exit(1);
	}

	const redirectUrl = shareCodeResponse.headers.get('Location');
	if (!redirectUrl) {
		console.error('No redirect URL found in response headers.');
		console.error('This might be because the share code is invalid / expired, or there is no order associated with it.');
		Deno.exit(1);
	}

	// now we have the redirect URL, we can fetch the order details by getting the order ID and order detail ID from the redirect URL
	const urlParts = new URL(redirectUrl);
	const orderId = urlParts.searchParams.get('orderId');
	const orderDetailId = urlParts.searchParams.get('orderDetailId');

	if (!orderId || !orderDetailId) {
		console.error('Order ID or Order Detail ID not found in redirect URL.');
		Deno.exit(1);
	}

	const orderResponse = await getFetch(sprintf(API_ORDER_FETCH, orderId, orderDetailId));
	if (!orderResponse.ok) {
		console.error(`Error fetching order details: ${orderResponse.status} ${orderResponse.statusText}`);
		Deno.exit(1);
	}

	let orderData: TicketAndPaymentResponse;
	try {
		orderData = (await orderResponse.json() as OrderResponse).payload;
	} catch (error) {
		console.error('Error parsing order response JSON:', error);
		Deno.exit(1);
	}


	for (const ticket of orderData.tickets) {
		console.log(`Ticket for ${ticket.initials} ${ticket.lastName}: ${ticket.secutixMobilePDFLink}`);
	}

	console.log(`Payment status: ${orderData.payment.status}`);
}
