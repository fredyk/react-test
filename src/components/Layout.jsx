import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
