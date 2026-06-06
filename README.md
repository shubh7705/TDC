# TDC Matchmaker Dashboard

An internal CRM and matchmaking dashboard designed for TDC's premium matchmaking service. This application empowers matchmakers to efficiently manage client journeys, track detailed biodata, record internal notes, and utilize AI-driven compatibility insights to recommend the perfect matches.

## Features

- **Matchmaker Dashboard**: View at-a-glance metrics including total active customers, pending match requests, and successful matches. Access a robust data table with filtering and search.
- **Detailed Customer Profiles**: Segmented user profiles specifically tailored for Indian matchmaking (Personal, Career, Family, Cultural, Partner Preferences).
- **Internal Notes CRM**: Maintain timestamped internal discussions and relationship insights directly on a customer's profile.
- **Match Engine**: A custom, deterministic matching algorithm tailored to calculate baseline compatibility scores across various factors (values, career, religion, lifestyle, etc.).
- **AI Match Assistant**: Integrated with OpenRouter API (`gpt-oss-120b:free`) to automatically read profiles, provide qualitative compatibility analysis (key strengths and concerns), and draft personalized email introductions.
- **Data Seeding**: Built-in developer tools to instantly seed realistic dummy data (powered by Faker) to jumpstart testing.

## Technology Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Auth/Global state) & [TanStack React Query](https://tanstack.com/query/latest) (Server state)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom premium color palettes (Ivory, Slate, Navy, Gold)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI) & [Lucide Icons](https://lucide.dev/)
- **Routing**: React Router
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore Database)
- **AI Integration**: [OpenRouter API](https://openrouter.ai/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Firebase Project (with Authentication and Firestore enabled)
- An OpenRouter API Key

### Installation

1. **Clone the repository** (or download the source):
   ```bash
   git clone <repository-url>
   cd TDC
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase and OpenRouter credentials:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   
   VITE_OPENROUTER_API_KEY="your_openrouter_api_key"
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Setup & Seeding

1. Go to the login screen and enter the demo credentials:
   - **Email:** `matchmaker@tdc.com`
   - **Password:** `Password123`
   *(The app will automatically register this account in your Firebase project on your first successful attempt).*
2. Once logged in, navigate to **Settings** on the sidebar.
3. Click **"Run Seed Script"** to populate Firestore with initial active customers and match pool candidates.

## Deployment

To deploy to Firebase Hosting:

1. Build the production app:
   ```bash
   npm run build
   ```
2. Initialize Firebase Hosting (if not done previously):
   ```bash
   firebase init hosting
   ```
   *(Ensure you configure it as a single-page app and set `dist` as your public directory).*
3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

## License
Proprietary & Confidential - TDC
