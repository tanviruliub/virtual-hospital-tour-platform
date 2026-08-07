import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Virtual Hospital Tour Platform',
  description: 'Interactive 360° virtual hospital tour, personalized route planner, AI avatar assistant, 3D medical visualization, pediatric adventure game, and clinical training simulation.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
