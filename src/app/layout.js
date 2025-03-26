import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <header>
          <nav className="nav">
            <h1 className="logo-text">AI.FIXØ.LIVE</h1>
            <button className="menu-toggle" aria-label="Open menu">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
            <ul className="nav-links">
              <li><a href="#tools">⚙️ AI TOOLS</a></li>
              <li><a href="#hot">📊 HOT AI</a></li>
              <li><a href="#e-commerce">📢 AI NEWS</a></li>
              <li><a href="#ai-chatbot">🤖 AI CHATBOT</a></li>
            </ul>
          </nav>
        </header>  
        {children}
        </body>
    </html>
  );
}
