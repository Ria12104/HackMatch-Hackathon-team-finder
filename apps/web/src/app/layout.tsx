import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HackMatch',
  description:
    'Find your perfect hackathon teammate. HackMatch connects developers, designers, and creators for hackathon success.',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full m-0">{children}</body>
    </html>
  );
}
