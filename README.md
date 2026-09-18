# Nourish Kids — Family Food & Meal Budget Assistant

**Nourish Kids** is a full-stack, compassionate web application designed to help parents, caregivers, and families optimize their food budgets, stretch pantry staples (like rice, beans, oats, canned tomatoes), and ensure children receive healthy, satisfying, and age-appropriate meals.

Powered by **Gemini 2.5 AI** and built with **React**, **Express**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. 🍚 5-Staple Miracle Recipes (Rice, Beans & Canned Tomatoes)
- **1. Creamy Tomato & Black Bean Rice Bowl** — Quick, rich, and protein-packed.
- **2. Mild Kid-Friendly Tomato & Lentil Rice Chili** — High in iron and costs pennies per portion.
- **3. Quick 15-Minute Rice & Bean Stuffed Tortilla** — Mess-free handheld pinwheels.
- **4. One-Pot Golden Tomato Rice with Beans & Peas** — Fluffy Spanish-style family rice.
- **5. Cheesy Tomato-Rice & Scrambled Egg Skillet** — High-protein 6-minute comfort skillet.
- Includes **Kid Hacks** (e.g. mashing beans into tomato sauce for picky eaters) and **Toddler Safety Notes**.

### 2. 📊 Interactive Grocery Budgeting & Expense Tracker
- Input your weekly food budget limit (e.g., $50, $75, $100).
- Log receipt items with item name, category, and cost.
- Live progress bar showing total spent, remaining funds, and over-budget warnings.
- **Cost-Cutting Opportunities Guide** highlighting store brand swaps, unit pricing, meat-stretching with lentils, and bulk savings.

### 3. 🗓️ 7-Day Meal Plan for a Family of Three
- Complete 7-day breakfast, lunch, dinner, and snack schedule tailored for 2 adults + 1 child (~$48/week total).
- **Consolidated Grocery List** organized by store department (Grains, Canned Goods, Produce, Dairy/Eggs).
- Interactive checkboxes for in-store shopping and one-click copy to clipboard.

### 4. 🚨 Emergency Food & Financial Relief Resources
- Instant access to **Dial 2-1-1** for local food banks, pantries, and meal delivery.
- Step-by-step guides for **WIC**, **SNAP / EBT**, and **School Free Lunch Programs**.

### 5. 🤖 Gemini-Powered Nourish AI Chat Assistant
- Ask real-time questions about stretching remaining groceries, child feeding safety, toddler choking prevention, or ingredient swaps.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nourish-kids.git
   cd nourish-kids
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🛠️ Build & Deployment

### Production Build
To bundle the frontend with Vite and compile the Express server with `esbuild`:
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

---

## 📁 Repository Structure

```
├── server.ts                 # Express backend server (Gemini proxy & static serving)
├── src/
│   ├── App.tsx               # Main application layout & active tab state
│   ├── components/
│   │   ├── Header.tsx                 # Navigation bar & emergency banner
│   │   ├── PantryStretchView.tsx      # Pantry Miracle recipe finder & staple recipes
│   │   ├── GroceryBudgetTracker.tsx   # Budget calculator, expense log & savings tips
│   │   ├── Family7DayPlanView.tsx     # 7-Day family meal plan & consolidated grocery list
│   │   ├── BudgetPlannerView.tsx      # $15/Wk structured grocery meal plans
│   │   ├── SubstitutionGuideView.tsx  # Swaps, hacks & toddler safety tips
│   │   ├── EmergencyResourcesView.tsx # 2-1-1, WIC, SNAP & food bank relief
│   │   ├── NourishAiChat.tsx          # Gemini AI Assistant
│   │   ├── RecipeDetailModal.tsx      # Detailed recipe viewer with step-by-step guidance
│   │   └── SavedRecipesModal.tsx      # Local saved recipes box
│   ├── data/
│   │   └── curatedRecipes.ts          # Curated budget recipes & 5 staple recipes
│   ├── types.ts              # TypeScript interfaces and types
│   ├── main.tsx               # React DOM root entry
│   └── index.css              # Global Tailwind CSS styling
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript config
└── README.md                 # Documentation
```

---

## FULFILLMENT / The Last Mile v0

Nourish contains an experimental local-first fulfillment specimen.

The reviewed pantry flow distinguishes:

- explicitly available requirements;
- explicitly missing requirements;
- undeclared/unknown requirements.

A recipe is never labeled **Can make now** from a partial ingredient match. Reviewed ingredient quantities scale to the declared number of people being fed, while equipment requirements do not multiply.

Known missing requirements can be projected into a local `fulfillment-envelope/v0` preview. The preview includes only the requirements the user selected and begins with `status: "unmet"`.

The fulfillment-envelope path does not send requests to Jubilee Campfire or any external service. The optional existing Gemini ideas remain a separate networked feature. V0 does not rank needs, infer deservingness, or claim real-world fulfillment. AI-generated meal ideas remain visibly separate from the reviewed local truth-state gate.

The first proof is only that one missing dinner requirement can cross the Nourish boundary without gaining facts, losing uncertainty, or leaking the rest of the pantry.

Verification: `npm test`, `npm run lint`, and `npm run build`.

---

## 📜 License

This project is open-source and released under the **MIT License**.
Made with care to support families everywhere!
