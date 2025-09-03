import { Shield } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "Privacy Policy Generator", href: "/generator/privacy-policy" },
        { name: "Terms of Service", href: "/generator/terms-of-service" },
        { name: "Cookie Consent", href: "/generator/cookie-consent" },
        { name: "Disclaimer", href: "/generator/disclaimer" },
        { name: "Acceptable Use Policy", href: "/generator/acceptable-use-policy" },
        { name: "Refund Policy", href: "/generator/refund-policy" },
        { name: "EULA", href: "/generator/eula" },
        { name: "Affiliate Agreement", href: "/generator/affiliate-agreement" },
        { name: "NDA", href: "/generator/nda" },
        { name: "Service Agreement", href: "/generator/service-agreement" },
        { name: "Independent Contractor Agreement", href: "/generator/independent-contractor-agreement" },
        { name: "Shipping Policy", href: "/generator/shipping-policy" },
        { name: "DMCA Policy", href: "/generator/dmca-policy" },
        { name: "Impressum", href: "/generator/impressum" },
        { name: "Guest Blogger Agreement", href: "/generator/guest-blogger-agreement" },
        { name: "Health Disclaimer", href: "/generator/health-disclaimer" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Support", href: "/contact" },
        { name: "Legal Updates", href: "/blog" },
        { name: "Status Page", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Privacy Policy", href: "/generator/privacy-policy" },
        { name: "Terms of Service", href: "/generator/terms-of-service" },
        { name: "Blog", href: "/blog" },
      ],
    },
  ];

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 mr-2" />
              <h3 className="text-2xl font-bold">Powered Legal</h3>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered legal document generation for modern businesses. Fast, reliable, and compliant.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('/') ? (
                      <Link href={link.href}>
                        <a className="text-gray-400 hover:text-white transition-colors">
                          {link.name}
                        </a>
                      </Link>
                    ) : (
                      <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Powered Legal. All rights reserved. Documents generated are for informational purposes only and do not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
