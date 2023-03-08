import { Route } from '@solidjs/router'
import { Component } from 'solid-js'
//import CharacterChats from './CharacterChats'
//import CreateCharacter from './CreateCharacter'
import MatchList from './MatchList'

//<Route path="/create" component={CreateCharacter} />
//<Route path="/create/:duplicateId" component={CreateCharacter} />
const MatchRoutes: Component = () => (
  <Route path="/likes">
    
    <Route path="/list" component={MatchList} />

  </Route>
)

export default MatchRoutes
