# 🚀 SpaceX Launch Explorer

A React-based web application to explore SpaceX launches with advanced features like sorting, filtering, searching, and pagination. Built with React, Vite, TypeScript, Mantine UI, and powered by the SpaceX API.

![SpaceX Launch Explorer Screenshot](https://via.placeholder.com/800x400) <!-- Add a relevant screenshot here -->

## 🛠 Features

- **Launch Listings**: View a list of SpaceX launches with search, filter, and sort capabilities.
- **Launch Details**: Detailed view of individual launches, including information about the rocket and success status.
- **Pagination**: Efficient pagination with customizable page size.
- **Search & Filter**: Search for launches by name and filter by success/failure status.
- **Sorting**: Sort launches by ascending or descending date.
- **Authentication** (To be implemented): Protect certain pages using token-based authentication.

## 🎨 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Mantine UI, Axios, React-Query
- **API**: SpaceX API v4
- **Backend** (To be implemented): MongoDB for session management, token-based authentication

## 📂 Directory Structure

```
.
├── .env
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src
│   ├── components
│   │   └── PrivateRoute.tsx
│   ├── pages
│   │   └── Landing.tsx
│   │   └── Login.tsx
│   │   └── PrivatePage.tsx
│   │   └── SpaceXDetailPage.tsx
│   │   └── SpaceXResourceList.tsx
│   ├── store
│   │   └── app.store.ts
│   ├── styles
│   │   └── abstracts
│   │       └── _colours.scss
│   │       └── _fonts.scss
│   └── theme
│       └── index.ts
```

## 🚀 Getting Started

To get started with the project, follow these steps:

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/spacex-launch-explorer.git
cd spacex-launch-explorer
```

2. Install dependencies:

```bash
npm install
# OR
yarn install
```

3. Set up environment variables by creating a `.env` file in the root directory:

```
VITE_SPACEX_API_URL=https://api.spacexdata.com/v4
```

### Running the Application

To start the application locally:

```bash
npm run dev
```

Then open [http://localhost:5175](http://localhost:5175) to view the application in your browser.

### Production Build

To build the application for production:

```bash
npm run build
```

### Linting

Lint the code for consistent formatting:

```bash
npm run lint
```

## 🧑‍💻 API Integration

We use the SpaceX API to fetch launch data. Here are the key API routes used in the project:

- `GET /launches` – Fetches all launches.
- `GET /launches/:id` – Fetches details of a specific launch.
- **Future Enhancements**: Additional data from the SpaceX API (like rockets, ships) will be integrated in future releases.

## 🎨 UI Improvements (Upcoming)

- Add better styling for the landing, login, and resources pages.
- Create consistent and responsive designs using Mantine.
- Add loading spinners and user-friendly error messages.

## 🛠️ Authentication (Upcoming)

- Implement token-based authentication.
- Store tokens securely in MongoDB.
- Protect routes like `/private` using authenticated user sessions.

## 💡 Future Features

- **Resource List Filtering**: Advanced filters and querying for SpaceX data.
- **Real-time Updates**: Auto-refresh launch data with live updates.
- **User Dashboard**: Create a user dashboard for logged-in users.
  
## 🎯 Bonus Features (To Be Integrated)

- **Deep Linking**: Allow users to share links to filtered results or specific launch details.
- **Advanced Search**: Implement advanced search with more query capabilities (e.g., search by rocket type, mission status).
  
## 🧪 Testing (Planned)

We plan to integrate testing using:
- Jest for unit testing.
- Cypress for end-to-end testing.

---

### 🌟 Contributions

We welcome contributions! Please fork the repository and create a pull request if you’d like to contribute.

---

### 📬 Contact

If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [Rahul Vishwakarma](https://github.com/Rahul-gif-asus)
- **Email**: karmarahul67@gmail.com
