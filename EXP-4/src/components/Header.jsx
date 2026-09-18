function Header({ children }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">P</div>

        <div>
          <h1 className="brand-title">
            PostFlow
          </h1>

          <span className="brand-subtitle">
            Scheduling & Performance Lab
          </span>
        </div>
      </div>

      {children}
    </header>
  );
}

export default Header;