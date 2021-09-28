import React, { Component } from 'react';
import '../css/pokemon_page.scss';

class PokemonPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          forms: [],
          sprite: [],
          order: "",
          evolutions: [],
          types: [],
          familiy: [],
          moves: [],
          items: [],
          descriptions: [],
        };
        sessionStorage.setItem("pokemon_id", 1);
      }
    
    componentDidMount() {
        fetch("https://pokeapi.co/api/v2/pokemon/" + sessionStorage.getItem("pokemon_id"))
            .then(res => res.json())
            .then(
            (result) => {
                this.setState({
                    moves : result.moves,
                    items: result.held_items,
                })
                fetch(result.species.url)
                    .then(res => res.json())
                    .then(
                        (result_species) => {
                            this.setState({
                                family: result_species.genera,
                                descriptions: result_species.flavor_text_entries,
                            })
                            fetch(result_species.evolution_chain.url)
                                .then(res => res.json())
                                .then(
                                    (result_evolution_name) => {
                                        var evolutions = [];
                                        evolutions.push(result_evolution_name.chain.species.name)
                                        evolutions.push(result_evolution_name.chain.evolves_to.map(species => species.species.name))
                                        result_evolution_name.chain.evolves_to.map(species => species.evolves_to.map(evolution => (
                                            evolutions.push(evolution.species.name)
                                        )))
                                        var evolutions_arr = [];
                                        evolutions.map(evos => (
                                            fetch("https://pokeapi.co/api/v2/pokemon/" + evos)
                                                .then(res => res.json())
                                                .then(
                                                    (result_evolution_sprite) => {
                                                        evolutions_arr.push(result_evolution_sprite)
                                                        this.setState({
                                                            evolutions: evolutions_arr,
                                                        })
                                                    },
                                            )))
                                        this.setState({
                                            isLoaded: true,
                                            forms: result.forms,
                                            sprite: result.sprites,
                                            order: result.order,
                                            types: result.types,
                                        });
                                    },
                            )
                        },
                    )
            },

            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
              }
            )
    }

    clickEvolution = (id, e) => {
        sessionStorage.setItem("pokemon_id", id);
        this.componentDidMount()
    }

    render() {
        const {error, isLoaded, forms, sprite, order, types, evolutions, family, moves, items, descriptions} = this.state;
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
                    <div class="body">
                        <ul>
                            <div className="identity">
                                <div className="name">
                                    {forms.map(form => (
                                        <li key={form}>
                                            <h1>{form.name} N°{order}</h1>
                                        </li>
                                    ))}
                                </div>
                                <img src={sprite.front_default} width="250px" heigt="100px" alt="pokedex"/>
                                <img src={sprite.front_shiny} width="250px" heigt="100px" alt="pokedex"/>
                                <div className="type">
                                    <h1>Types</h1>
                                    <div class="types">
                                        {types.map((pokemon_types, index) => (
                                            <img key={index} src={"./img/" + pokemon_types.type.name + ".png"} width="50px" heigth="25px" alt={pokemon_types.type.name}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="evolve">
                                <h1> Évolutions ! </h1>
                                {evolutions.map((evos, index) => (
                                    <p key={index}>
                                        {evos.sprites !== undefined &&
                                            <button onClick={this.clickEvolution.bind(null, evos.name)} key={index}>
                                                <img src={evos.sprites.front_default} width="250px" heigt="100px" alt="pokedex"/>
                                            </button>
                                        }
                                    </p>
                                ))}
                            </div>
                            <div className="family">
                                <h1>Family : </h1>
                                <h2>{family[7].genus}</h2>
                            </div>
                        </ul>
                       <div class="moves">
                           <h1>Moves :</h1>
                           <table>
                               {moves.map((move, index) => (
                                   <tbody key={index}>
                                   <tr>
                                       <td>{move.move.name}</td>
                                   </tr>
                                   </tbody>
                               ))}
                           </table>
                       </div>
                        <div class="items">
                            {items.length > 0 &&
                            <h1>Items :</h1>
                            }
                            {items.map((item, index) => (
                                <p key={index}>{item.item.name}</p>
                            ))}
                        </div>
                        <div class="desc">
                            <h1>Descriptions :</h1>
                            <table>
                                {descriptions.map((description, index) => (
                                    <tbody key={index}>
                                        {description.language.name === 'en' &&
                                        <tr>
                                            <td class="name">{description.version.name} :</td>
                                            <td class="text">{description.flavor_text}</td>
                                        </tr>
                                        }
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div>
                </React.Fragment>
            );
          }
    }
}

export default PokemonPage;