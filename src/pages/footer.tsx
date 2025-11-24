export default function Footer () {
  return (
    <footer className="bg-gray-900 text-gray-400 px-8 py-2 bottom-0 w-full fixed">
      <div
        className="px-4 flex flex-col sm:flex-row 
                  items-center justify-between text-sm"
      >
        <p className="text-gray-500">
          © {new Date().getFullYear()} RentHub. All rights reserved.
        </p>

        <div className="flex gap-4 mt-2 sm:mt-0 text-gray-400">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
