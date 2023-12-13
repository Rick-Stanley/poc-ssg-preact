import renderToString from 'preact-render-to-string'
import { prerender } from 'preact-iso'
import { App } from './app'

export function render(url: string) {
    /* const html = renderToString(<App />) */
    /* return { html } */
  return prerender(
    <App url={url}/>
  );
}
