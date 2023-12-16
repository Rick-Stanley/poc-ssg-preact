import { prerender } from 'preact-iso'
import { App } from './app'

export function render(url: string) {
  return prerender(
    <App url={url} />
  );
}
