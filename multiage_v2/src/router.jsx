/**
 * Lightweight client-side router using the History API.
 * Drop-in replacement for react-router-dom <BrowserRouter> / <Routes> / <Route>.
 * No npm dependency required.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const RouterCtx = createContext(null);
const ParamsCtx = createContext({});

function matchPath(routePath, currentPath) {
  const routeParts = routePath.replace(/\/$/, "").split("/").filter(Boolean);
  const pathParts = currentPath.replace(/\/$/, "").split("/").filter(Boolean);

  if (routeParts.length !== pathParts.length) {
    return null;
  }

  const params = {};

  for (let i = 0; i < routeParts.length; i += 1) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (routePart !== pathPart) {
      return null;
    }
  }

  return params;
}

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
  let matchedParams = {};
  const arr = Array.isArray(children) ? children : [children];
  for (const child of arr) {
    const { path: routePath, element } = child.props;
    if (routePath === "*") { matched = matched ?? element; continue; }
    const params = matchPath(routePath, path);
    if (params) {
      matched = element;
      matchedParams = params;
      break;
    }
  }
  return <ParamsCtx.Provider value={matchedParams}>{matched}</ParamsCtx.Provider>;
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

export function useParams() {
  return useContext(ParamsCtx);
}
