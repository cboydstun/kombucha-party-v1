import { Outlet } from "react-router";

import Navigation from "./components/Navigation.jsx";

function App() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <Navigation />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
