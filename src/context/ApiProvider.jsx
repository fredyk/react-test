import { ApiContext } from './ApiContext.js';

export function ApiProvider({ api, children }) {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
