import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="header">
      <div className="header__bar">
        <Link className="header__title" to="/">
          ITX Mobile Shop
        </Link>
      </div>
    </header>
  );
}
