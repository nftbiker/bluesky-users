import './globals.css'

export const metadata = {
  title: 'Bluesky User Search',
  description: 'Search for Bluesky users',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}