import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import './app.css'
import Router, { Link, Route } from 'preact-router'

const pages = import.meta.glob<typeof import('./pages/Home.tsx')>('./pages/*.jsx', { eager: true })

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)?.at(1)

  if (!name) throw new Error(`Not possible to recover page name from path: ${name}`);
  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: pages[path].default,
  }
})

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <ul>
        {
          routes.map(({ name, path }) => {
            return (
              <li>
                <Link href={path}>{name}</Link>
              </li>
            )
          })
        }
      </ul>
      <h1>Vite + Preact</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
      <Router>
        {
          routes.map(({ path, component: RouteComponent }) => {
            return <Route key={path} path={path} component={RouteComponent} />
          })
        }
      </Router>
    </>
  )
}
