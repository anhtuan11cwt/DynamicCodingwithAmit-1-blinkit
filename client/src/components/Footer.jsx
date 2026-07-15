import {
  FaCopyright,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const socialLinks = [
  { href: "https://facebook.com", Icon: FaFacebook, label: "Facebook" },
  { href: "https://instagram.com", Icon: FaInstagram, label: "Instagram" },
  { href: "https://linkedin.com", Icon: FaLinkedin, label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="border-gray-200 border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 lg:flex-row lg:justify-between">
        <p className="flex items-center gap-2 text-gray-600 text-sm">
          <FaCopyright
            aria-hidden="true"
            className="text-lg text-secondary-100"
          />
          <span>2026 Blinkit. Bảo lưu mọi quyền.</span>
        </p>

        <nav aria-label="Mạng xã hội">
          <ul className="flex items-center gap-5">
            {socialLinks.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  aria-label={label}
                  className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-2xl text-gray-600 outline-none transition-all duration-300 hover:scale-110 hover:text-primary-200 focus-visible:ring-2 focus-visible:ring-primary-200"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
