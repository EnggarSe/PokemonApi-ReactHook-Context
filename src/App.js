import React from 'react'
import './App.css';
import 'antd/dist/antd.css';

//Content
import PokemonList from './pokemon/pokemonlist'

//Context
import PokemonProvider from './pokemon/pokemonContext'

function App() {
  return (
    <div className="App">
       <PokemonProvider>
         <PokemonList />
       </PokemonProvider>
    </div>
  );
}

export default App;
