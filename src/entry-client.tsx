import './index.css'
import { hydrate } from 'preact-iso'
import { App } from './app'

hydrate(<App />, document.getElementById('app') as HTMLElement)
