# 📚 BookIt: Experiences & Slots

**Name = Md Kaif Nawaz Khurram** \
**Date = 31/10/2025**

An end-to-end web application that allows users to explore travel experiences, view available slots, and complete bookings seamlessly.

This project demonstrates the complete workflow of a modern fullstack application — from UI design fidelity to backend data handling and database integration.

---

## 💡 Features

- 🏖️ Browse curated travel experiences.  
- 📅 View available dates and slot timings.  
- 🛒 Complete bookings with promo code validation.  
- 💾 Data stored using PostgreSQL database.  
- 📱 Fully responsive and mobile-friendly design.  
- ⚡ Dynamic flow: **Home → Details → Checkout → Result**.  
- 🎨 Design matches provided Figma reference.

---

## 🎟️ Promo Codes

Two sample promo codes are supported in the checkout flow:

| Code | Description |
|------|--------------|
| `SAVE10` | Sample 10% discount on total booking |
| `FLAT100` | Sample ₹100 off on eligible bookings |

*(These are sample discounts used for demonstration purposes.)*

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally:

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd BookIt
```

### 2️⃣ Install Dependencies 

```undefined
npm install
# or
yarn install
```

### 3️⃣ Setup The Postgres Database

*create a Postgres locally or on a Cloud service(eg. SupaBase, Render, Neon)

*copy your database connection pool

```undefined
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```


### 4️⃣.	Start the Development Server

```undefined
npm run dev
# or
yarn dev
```

##  📁 Project Structure 

```undefined
BookIt/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page (browse experiences)
│   │   ├── details/           # Experience details page
│   │   ├── checkout/          # Checkout flow page
│   │   └── result/            # Booking confirmation page
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Database utilities & configurations
│   └── styles/                # Global styles and CSS modules
├── public/                    # Static assets (images, icons)
├── database/                  # Database scripts and migrations
├── .env.local                 # Environment variables (DATABASE_URL)
├── package.json               # Dependencies
└── README.md                  # Project documentation

```