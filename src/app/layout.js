import './globals.css'

export const metadata = {
  title: 'Bluesky artbots search',
  description: 'Search for Bluesky arbots made by @botfrens',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}