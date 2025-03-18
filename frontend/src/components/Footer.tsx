




import { Link } from "react-router"; // Fix: Updated import path

function Footer() {
  const items = [
    { id: 1, name: "Campaigns" },
    { id: 2, name: "Email Marketing" },
    { id: 3, name: "Branding" },
    { id: 4, name: "Offline" },
    { id: 5, name: "Contact" },
    { id: 6, name: "FAQs" },
  ];

  return (
    <footer className="w-full container bg-customYellow">
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link to="/">
            <h2 className="h2-bold text-customBrown">
              Pizza
              <span className="text-customYellow bg-customBrown rounded-sm px-2">
                Rush
              </span>
            </h2>
          </Link>
          <p className="paragraph-small max-w-[400px] mt-4 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor{" "}
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-8 text-center">
          {items.map((item) => (
            <div key={item.id}>
              <Link
                to="/"
                className="hover:text-customGrayDark font-medium"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Pizza Rush. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;