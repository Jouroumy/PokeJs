import React, { Component } from 'react';
import '../css/pokedex.scss';

class Pokedex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false, 
            pokemon_list: [],
            pokemon_sprites: [],
            pokemon_types: [],
            limit: 10,
            start: 0,
            page: 0,
        };
      }

    componentDidMount() {
        var temp_pokemon_sprite = [];
        var temp_pokemon_types = [];
        fetch("https://pokeapi.co/api/v2/pokemon?limit="+ this.state.limit + "&offset=" + this.state.start)
            .then(res => res.json())
            .then(
            (result) => {
                this.setState({
                    pokemon_list: result.results,
                })
                result.results.map(pokemon_result => (
                    fetch(pokemon_result.url)
                        .then(res => res.json())
                        .then(
                            (result_pokemon) => {
                                temp_pokemon_sprite.push(result_pokemon.sprites.front_default)
                                this.setState({
                                    isLoaded: true,
                                    pokemon_sprites: temp_pokemon_sprite,
                                    pokemon_types: temp_pokemon_types,
                                })
                            }
                        )
                )) 
                    
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
              }
            )
    }

    nextPokemon = (e) => {
        this.setState({
            start: this.state.start + this.state.limit,
            page: this.state.page + 1,
        })
        this.componentDidMount()
    }
    previousPokemon = (e) => {
        this.setState({
            start: this.state.start - this.state.limit,
            page: this.state.page - 1,
        })
        this.componentDidMount()
    }

    render() {
        var {error, isLoaded, pokemon_list, pokemon_sprites} = this.state; 
        if (error) {
            return <div>Erreur : {error.message}</div>;
          } else if (!isLoaded) {
            return <div>Chargement…</div>;
          } else {
            return (
                <React.Fragment>
                    <div class="header">
                        <img src="./img/pokedex.png" width="250px" heigt="100px" alt="pokedex"/>
                    </div>
                    <br></br>
                    <table>
                        <tbody>
                            {pokemon_list.map((pokemon, index) => (
                                <tr key = {index}>
                                    <td>{index + 1 + (this.state.limit * this.state.page)}</td>
                                    <td>{pokemon.name}</td>
                                    <td><img src={pokemon_sprites[index]} width="250px" heigt="100px" alt="pokedex"/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={this.previousPokemon.bind(null)}>Previous</button>
                    <button onClick={this.nextPokemon.bind(null)}>Next</button>
                </React.Fragment>
            );
        }
    }
}
 
export default Pokedex;