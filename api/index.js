const express = require('express');
const app = express();

app.use(express.json());

// Khurshid Kitab Ghar Book Catalog
const books = [
  { id: 1, title: "اردو - پہلی جماعت (Gauhar Urdu Class 1)", price: 280, category: "Class 1" },
  { id: 2, title: "English - Class 1 (Book Wise)", price: 320, category: "Class 1" },
  { id: 3, title: "Mathematics - Class 1", price: 300, category: "Class 1" },
  { id: 4, title: "General Science - Class 2", price: 350, category: "Class 2" },
  { id: 5, title: "اسلامیات - دوسری جماعت", price: 260, category: "Class 2" },
  { id: 6, title: "معاشرتی علوم - تیسری جماعت", price: 340, category: "Class 3" },
  { id: 7, title: "Summer Vacation Task - Class 1 to 5 (Pack)", price: 450, category: "Summer Task" }
];

let orders = [];

// API Endpoint: Get Books
app.get('/api/books', (req, res) => {
  res.json({ success: true, books });
});

// API Endpoint: Place Order
app.post('/api/order', (req, res) => {
  const { schoolName, phone, items, totalAmount, paymentMonths } = req.body;

  if (!schoolName || !phone || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "براہ کرم تمام معلومات درست فراہم کریں۔" });
  }

  const invoiceNo = "KKG-" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleDateString('ur-PK');

  const newOrder = {
    invoiceNo,
    orderDate,
    schoolName,
    phone,
    items,
    totalAmount,
    paymentMonths
  };

  orders.push(newOrder);

  // Formatting WhatsApp Invoice Message
  let orderItemsList = items.map(item => `• \({item.title} (Rs.\){item.price})`).join('%0A');
  
  const waMessage = `*خورشید کتاب گھر اینڈ ایجوکیشنل سروسز*%0A` +
                    `*آن لائن آرڈر انوائس*%0A----------------------------------%0A` +
                    `*انوائس نمبر:* ${invoiceNo}%0A` +
                    `*تاریخ:* ${orderDate}%0A` +
                    `*سکول کا نام:* ${schoolName}%0A` +
                    `*رابطہ نمبر:* ${phone}%0A` +
                    `*ادائیگی کی مدت:* ${paymentMonths}%0A----------------------------------%0A` +
                    `*تفصیلات آرڈر:*%0A${orderItemsList}%0A----------------------------------%0A` +
                    `*کل قابل ادا رقم:* Rs. ${totalAmount}%0A----------------------------------%0A` +
                    `شکریہ! آپ کا آرڈر موصول ہو چکا ہے۔ ہم جلد آپ سے رابطہ کریں گے۔`;

  res.json({
    success: true,
    invoiceNo,
    whatsappUrl: `https://wa.me/\({phone}?text=\){waMessage}`
  });
});

module.exports = app;
