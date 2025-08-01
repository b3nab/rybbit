/* eslint-env node */
import { Tilt_Warp } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { cn } from "../lib/utils";
import "./globals.css";
import { PostHogProvider } from "./providers";

const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  metadataBase: new URL("https://rybbit.io"),
  title: {
    template: "%s - Rybbit",
    default: "Rybbit - The Modern Google Analytics Replacement",
  },
  description: "Next-gen, open source, lightweight, cookieless web & product analytics for everyone.",
  // description: 'Next-gen, open source, lightweight, cookieless web & product analytics for everyone — GDPR/CCPA compliant.',
  applicationName: "Rybbit",
  generator: "Next.js",
  alternates: {
    canonical: "https://rybbit.io",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rybbit.io",
    siteName: "Rybbit",
    title: "Rybbit - The Modern Google Analytics Replacement",
    description: "Next-gen, open source, lightweight, cookieless web & product analytics for everyone.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Rybbit - The Modern Google Analytics Replacement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rybbit_io",
    creator: "@rybbit_io",
    title: "Rybbit - The Modern Google Analytics Replacement",
    description: "Next-gen, open source, lightweight, cookieless web & product analytics for everyone.",
    images: ["/opengraph-image.png"],
  },
  appleWebApp: {
    title: "Rybbit",
  },
  other: {
    "msapplication-TileImage": "/ms-icon-144x144.png",
    "msapplication-TileColor": "#fff",
  },
};

function Footer_() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950/50">
      <div className="max-w-[1300px] mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Image src="/rybbit-text.svg" alt="Rybbit" width={120} height={27} />
            {/* <p className="text-sm text-neutral-400 max-w-xs">
              Open source, privacy-focused web analytics platform that respects
              user privacy.
            </p> */}
            {/* ProductHunt Badge */}
            <div className="mt-4">
              <a
                href="https://www.producthunt.com/products/rybbit?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_source=badge-rybbit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=981885&theme=dark&period=daily&t=1751440591330"
                  alt="Rybbit - The open source Google Analytics replacement | Product Hunt"
                  style={{ width: "200px", height: "43px" }}
                  width="200"
                  height="43"
                />
              </a>
            </div>
            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="https://github.com/rybbit-io/rybbit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/DEhGb4hYBj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://x.com/yang_frog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-neutral-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href="https://app.rybbit.io"
                  className="text-neutral-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="https://app.rybbit.io/signup"
                  className="text-neutral-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/rybbit-io/rybbit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/DEhGb4hYBj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Community
                </a>
              </li>
              <li>
                <Link href="/docs/api" className="text-neutral-400 hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:hello@rybbit.io" className="text-neutral-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-400">© {new Date().getFullYear()} Rybbit. All rights reserved.</div>
            <div className="text-sm text-neutral-400">Made with ❤️ by frogs</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// JSON-LD structured data for organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rybbit",
  description: "Open source, privacy-focused web analytics platform",
  url: "https://rybbit.io",
  logo: "https://rybbit.io/rybbit.svg",
  sameAs: ["https://github.com/rybbit-io/rybbit"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@rybbit.io",
    contactType: "customer support",
  },
};

// JSON-LD structured data for software application
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rybbit",
  applicationCategory: "Analytics",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    priceValidUntil: "2025-12-31",
  },
  description: "Open source web analytics platform that respects user privacy",
  softwareVersion: "1.0",
  url: "https://rybbit.io",
  author: {
    "@type": "Organization",
    name: "Rybbit",
  },
};

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={<Image src="/rybbit-text.svg" alt="Rybbit" width={110} height={27} />}
      chatLink="https://discord.gg/DEhGb4hYBj"
      projectLink="https://github.com/rybbit-io/rybbit"
      children={
        <a href="https://app.rybbit.io">
          <button className="bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium px-3 py-1.5 rounded-md border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50 cursor-pointer">
            Login
          </button>
        </a>
      }
    />
  );
  const pageMap = await getPageMap();

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
        color={{
          hue: 158,
          saturation: 64,
          lightness: 51,
        }}
      />
      <script
        src="https://demo.rybbit.io/api/script.js"
        data-site-id="21"
        defer
        data-session-replay="true"
        data-web-vitals="true"
        data-track-errors="true"
        {...(isDev && {
          "data-api-key": process.env.NEXT_PUBLIC_RYBBIT_API_KEY,
        })}
      ></script>
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="bd7e35bc-5718-474e-a60d-1a775139a16d"
      ></script>
      <body>
        <Layout
          // banner={
          //   <div className="text-center text-sm text-neutral-100 pt-2 pb-1 bg-neutral-700/50 flex items-center justify-center gap-2">
          //     <div className="mb-1">
          //       🚀 We just launched! Please star us on Github!{" "}
          //     </div>
          //     <a
          //       className="github-button"
          //       href="https://github.com/rybbit-io/rybbit"
          //       data-color-scheme="no-preference: light; light: light; dark: light;"
          //       data-show-count="true"
          //       aria-label="Star rybbit-io/rybbit on GitHub"
          //     ></a>
          //   </div>
          // }
          navbar={navbar}
          footer={<Footer_ />}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/rybbit-io/rybbit/tree/master/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
          nextThemes={{
            defaultTheme: "dark",
            forcedTheme: "dark",
          }}
        >
          {children}
        </Layout>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      </body>
    </html>
  );
}
