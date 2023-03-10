import { Route } from '@solidjs/router'
import {Component} from 'solid-js'
import MatchList from './MatchList'
import MatchProfile from './MatchProfile'

const MatchRoutes: Component = () => (
  <Route path="/likes">
    <Route path="/list" component={MatchList} />
    <Route path="/:id/match" component={MatchList} />
    <Route path="/:id/profile" component={MatchProfile} />
    </Route>

)

export default MatchRoutes
