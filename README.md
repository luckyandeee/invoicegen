# Travel Invoice generator System

This Node.js application is designed to handle travel booking confirmations by generating invoices, sending emails, and submitting booking details to a Google Form. It offers the following features:

## Features

- **Invoice Generation**: A detailed invoice is generated with booking, guest, tariff plan, and financial details.
- **Email Sending**: The invoice is sent via email using Nodemailer.
- **Google Forms Integration**: Booking details are submitted to a specified Google Form.
- **WhatsApp Integration**: A link for WhatsApp message sharing is generated.

## Requirements

- Node.js
- Nodemailer
- Node-fetch

## File Structure

- `index.js`: The main server file containing the Express app, routes, and helper functions.
- `public/`: Directory containing static files, including the HTML form.
- `package.json`: Project metadata and dependencies.

