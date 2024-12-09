import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">
            StoryMap
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-gray-700 hover:text-indigo-600">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-700 hover:text-indigo-600">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-3 text-center">
          <p>&copy; {new Date().getFullYear()} StoryMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
