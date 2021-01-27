import React, {useState, createContext, useEffect} from 'react'
import axios from 'axios'

export const PokemonContext = createContext () 

const PokemonProvider = (props) => {
   const [pokemonList, setPokemonList] = useState ([]);
   const [count, setCount] = useState()
   const [previous, setPrevious] = useState()
   const [next, setNext] = useState()
   const [loaded, setLoaded] = useState(true)
   const [page, setPage] = useState(1)
   const [yourPoke, setYourPoke] = useState([])

   useEffect(() => {
      function listPokemon(){
         axios.get("https://pokeapi.co/api/v2/pokemon")
         .then((res) =>{
            // setPokemonList(res.data.results)
            setCount(res.data.count)
            setPrevious(res.data.previous)
            setNext(res.data.next)
            getPokemon(res.data.results)
            setLoaded(false)
         })
         .catch((err) => {
            console.log(err);
         })
      }
     

      listPokemon();  
      yourPokemon();
   }, []);

  
   const yourPokemon = () =>{
      axios.get("https://5e8ecf49fe7f2a00165ee9ff.mockapi.io/todo")
      .then((res) =>{
         // setPokemonList(res.data.results)
         setYourPoke(res.data)
         setLoaded(false)
      })
      .catch((err) => {
         console.log(err);
      })
   }

   const getPokemon = async(data) => {
         await Promise.all(
            data.map(async pokemon =>{
               axios.get(pokemon.url)
               .then((res) => {
                  setPokemonList(state => [...state, res.data])
                  console.log(res, 'RESPONSE');
                  
               }).catch((err => {
                  console.log(err, 'error');
               }))
            }))    
   }

   const nextAction = () => {
      console.log(next, 'NEXT');
      setPokemonList([])
      setLoaded(true)
      axios.get(next)
      .then((res) => {
         getPokemon(res.data.results)
         setPrevious(res.data.previous)
         setNext(res.data.next)
         setLoaded(false)
         setPage(page+1)
      })
      .catch((err) => {
         console.log(err, 'error');
         
      })
   }

   const prevAction = () => {
      if(previous!==null){
         console.log(previous, 'prev');
         setPokemonList([])
         setLoaded(true)
         axios.get(previous)
         .then((res) => {
            getPokemon(res.data.results)
            setPrevious(res.data.previous)
            setNext(res.data.next)
            setLoaded(false)
            setPage(page-1)
         })
         .catch((err) => {
            console.log(err, 'error'); 
         })
      }
   }


   return (
      <PokemonContext.Provider value = {{pokemonList, count, previous, next, loaded, nextAction, prevAction, page, yourPoke, yourPokemon}}>
         {props.children}
      </PokemonContext.Provider>
   );
}

export default PokemonProvider;