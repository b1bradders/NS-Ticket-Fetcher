# NS Ticket Fetcher
Downloads your tickets from NS (Dutch Railways), as PDFs... because that's literally what they are on the mobile app.

## Requirements
- The NS app installed on your phone, so you can get the "Share" link of your ticket(s).
- A computer with Deno installed.

## Usage
1. Open the NS app on your phone.
2. Go to the tickets you want to download.
3. Tap the "Share" button, it should give you a link with a short code (e.g. `Ab1cDE2F`)
4. Run the following command in your terminal, replacing `<code>` with the actual short code:
   ```bash
   deno run --allow-net https://raw.githubusercontent.com/StupidRepo/ns-ticket-fetcher/main/main.ts <code>
   ```
5. The script will return a link of the PDF file(s) containing a ticket. You can open this link in your browser to view or download the PDF.