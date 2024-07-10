const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // Serve static files from the "public" directory

// Email credentials
const email = "codingninjas2k16@gmail.com";
const password = "slwvvlczduktvhdj";

// Creating a transporter object using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

// Route to generate and send the invoice
app.post("/generate-invoice", async (req, res) => {
  const {
    bookingid,
    bookingdate,
    traveldate,
    tripenddate,
    placetovisit,
    customername,
    customerphone,
    customeremail,
    tariff,
    numberofpax,
    bookingstatus,
    totalfare,
    advanceamt,
    balanceamt,
  } = req.body;

  try {
    const message = `
    *Travel Confirmation Summary*
    
    *Booking Details:*
    - *Receipt ID:* ${bookingid}
    - *Booking Date:* ${bookingdate}
    - *Trip Start Date:* ${traveldate}
    - *Trip End Date:* ${tripenddate}
    - *Places to Visit:* ${placetovisit}
    
    *Guest Details:*
    - *Name:* ${customername}
    - *Contact No:* ${customerphone}
    - *Email:* ${customeremail}
    
    *Tariff Plan:*
    - *Tariff:* ${tariff}
    - *No of Pax:* ${numberofpax}
    - *Booking Status:* ${bookingstatus}
    
    *Financial Details:*
    - *Total Fare:* ${totalfare}
    - *Advance:* ${advanceamt}
    - *Balance:* ${balanceamt}
    `;

// For email, you can use HTML tags for styling, for example:
const emailMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Travel Confirmation Summary</title>
  <style>
    /* Inline CSS styles */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
      padding: 20px;
    }
    h2 {
      color: #007bff;
      margin-bottom: 10px;
    }
    h3 {
      color: #333;
      margin-bottom: 8px;
    }
    ul {
      margin-bottom: 15px;
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
    }
    strong {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h2>Travel Confirmation Voucher</h2>

  <h3>Booking Details:</h3>
  <ul>
    <li><strong>Receipt ID:</strong> ${bookingid}</li>
    <li><strong>Booking Date:</strong> ${bookingdate}</li>
    <li><strong>Trip Start Date:</strong> ${traveldate}</li>
    <li><strong>Trip End Date:</strong> ${tripenddate}</li>
    <li><strong>Places to Visit:</strong> ${placetovisit}</li>
  </ul>

  <h3>Guest Details:</h3>
  <ul>
    <li><strong>Name:</strong> ${customername}</li>
    <li><strong>Contact No:</strong> ${customerphone}</li>
    <li><strong>Email:</strong> ${customeremail}</li>
  </ul>

  <h3>Tariff Plan:</h3>
  <ul>
    <li><strong>Tariff:</strong> ${tariff}</li>
    <li><strong>No of Pax:</strong> ${numberofpax}</li>
    <li><strong>Booking Status:</strong> ${bookingstatus}</li>
  </ul>

  <h3>Financial Details:</h3>
  <ul>
    <li><strong>Total Fare:</strong> ${totalfare}</li>
    <li><strong>Advance:</strong> ${advanceamt}</li>
    <li><strong>Balance:</strong> ${balanceamt}</li>
  </ul>

  <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
</body>
</html>
`;


    // Send email with the invoice message
    await sendEmail(customeremail, emailMessage);


    // Submit form data to Google Forms
    await submitFormDataToGoogleForms(req.body);

    // Generate WhatsApp message link
    const whatsappNumber = customerphone.replace(/^0+/, '');
    const whatsappLink = generateWhatsAppLink(whatsappNumber, message);



    // Return the response
    res.json({
      message: "Invoice generated and sent successfully",whatsappLink,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the invoice" });
  }
});

// Function to send email
const sendEmail = (recipientEmail, message) => {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: email,
        to: recipientEmail,
        subject: "Your Invoice",
        html: message,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };
  
  // Function to generate WhatsApp link
  const generateWhatsAppLink = (phoneNumber, message) => {
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
  };


  // Function to submit form data to Google Forms
const submitFormDataToGoogleForms = async (formData) => {
    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLScQ3-YgL_5y-8kYVe0aAxeZ1AQ8yySY5SrJgd8fZVfzpkhdVg/formResponse";
  
    const params = new URLSearchParams();
    params.append("entry.805596603", formData.bookingid);
    params.append("entry.239565299", formData.bookingdate);
    params.append("entry.886471205", formData.bookingdate);
    params.append("entry.691954462", formData.traveldate);
    params.append("entry.2056930898", formData.tripenddate);
    params.append("entry.935968935", formData.placetovisit);
    params.append("entry.1932475624", formData.customername);
    params.append("entry.1932475624", formData.customerphone);
    params.append("entry.1415466766", formData.customeremail);
    params.append("entry.1216764673", formData.tariff);
    params.append("entry.644676438", formData.numberofpax);
    params.append("entry.1679461779", formData.bookingstatus);
    params.append("entry.497727710", formData.totalfare);
    params.append("entry.730682430", formData.advanceamt);
    params.append("entry.1143256228", formData.balanceamt);
    params.append("entry.896380471", formData.aadhar);
    params.append("entry.675916542", formData.inclusion);
    params.append("entry.257027079", formData.customeraddress);
  
    try {
      const response = await fetch(formUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });
  
      if (response.ok) {
        console.log("Form data submitted successfully to Google Forms");
      } else {
        throw new Error("Failed to submit form data to Google Forms");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  };


// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// usp=pp_url&=1&=11&=111&=1111&=11111&=111111&=1&=11&=111&=1111&=11111&=111111&=1&=11&=111&=1111&=11111&entry.1565666026=111111
