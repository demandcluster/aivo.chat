import { Route } from '@solidjs/router'
import {Component} from 'solid-js'
import Help from './help'
import Policy from './policy'
import Terms from './terms'

const HelpPage: Component = () => (
  <Route path="/help">
    <Route path="/" component={Help} />
    <Route path="/policy" component={Policy} />
    <Route path="/terms" component={Terms} />
  </Route>
)

export default HelpPage
