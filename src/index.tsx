const pages = import.meta.glob<typeof import('./pages/Home.tsx')>('./pages/*.tsx', { eager: true })

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.tsx$/)?.at(1)

  if (!name) throw new Error(`Not possible to recover page name from path: ${name}`);
  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: pages[path].default,
  }
})

export default routes;
