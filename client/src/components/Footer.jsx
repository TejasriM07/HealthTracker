import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Health Tracker. Built with ❤️ by Your Name.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;