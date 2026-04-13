/**
 * Lightweight client-side router using the History API.
 * Drop-in replacement for react-router-dom <BrowserRouter> / <Routes> / <Route>.
 * No npm dependency required.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const RouterCtx = createContext(null);

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = useCallback((to) => {
    window.history.pushState(null, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterCtx.Provider value={{ path, navigate }}>
      {children}
    </RouterCtx.Provider>
  );
}

export function Routes({ children }) {
  const { path } = useContext(RouterCtx);
  let matched = null;
  const arr = Array.isArray(children) ? children : [children];
  for (const child of arr) {
    const { path: routePath, element } = child.props;
    if (routePath === "*") { matched = matched ?? element; continue; }
    if (routePath === path || routePath === path.replace(/\/$/, "")) {
      matched = element; break;
    }
  }
  return matched;
}

export function Route({ path, element }) { return null; }

export function Link({ to, children, style = {}, ...rest }) {
  const { navigate } = useContext(RouterCtx);
  return (
    <a href={to} style={style} {...rest}
      onClick={e => { e.preventDefault(); navigate(to); }}>
      {children}
    </a>
  );
}

export function useNavigate() {
  const { navigate } = useContext(RouterCtx);
  return navigate;
}

export function useLocation() {
  const { path } = useContext(RouterCtx);
  return { pathname: path };
}
