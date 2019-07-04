import React, { Component } from 'react'
import axios from 'axios';
import { switchCase } from '@babel/types';
const Poke_types = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
  };
export default class Pokemon extends Component {
    state = {
        name :'',
        pokemonIndex:'',
        imageUrl:'',
        types:[],
        description:'',
        stats:{
            hp:'',
            attack:'',
            defence:'',
            speed:'',
            specialAttack:'',
            specialDefence:''
        },
        height:"",
        weight:"",
        eggGroups:"",
        abilities:"",
        genderRatioMale:"",
        genderRatioFemale:"",
        eva:"",
        hatchSteps:""

    }
    async componentDidMount()
    {
        const{pokemonIndex}=this.props.match.params;
        // urls to pokemom information 
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
        const pokemonRespons = await axios.get(pokemonUrl);
        const name = pokemonRespons.data.name;
        const imageUrl= pokemonRespons.data.sprites.front_default;
        
        let{hp,attack,defence,speed,specialAttack,specialDefence}='';
        pokemonRespons.data.stats.map(stat=>{
            switch(stat.stat.name)
            {
                case 'hp':
                    hp=stat['base_stat'];
                    break;
                case 'attack':
                    attack=stat['base_stat'];
                    break;
                case 'defense':
                    defence=stat['base_stat'];
                    break;
                case 'speed':
                    speed=stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack=stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefence=stat['base_stat'];
                    break;
                default:
                    break;
            }
        });
        const height = pokemonRespons.data.height*10;
        const weight = pokemonRespons.data.weight/10;
        const types = pokemonRespons.data.types.map(type=>type.type.name);
        const abilities = pokemonRespons.data.abilities.map(ability=>{
            return ability.ability.name.toLowerCase().split('-')
            .map(s=>s.charAt(0).toUpperCase()+s.substring(1)).join(' ');
        }).join(', ');
        const evs = pokemonRespons.data.stats.filter(stat=>{
            if(stat.effort>0)
            {
                return true;
            }    
            return false;
        }).map(stat =>{
            return `${stat.effort} ${stat.stat.name}`.toLowerCase().split('-')
                .map(s=>s.charAt(0).toUpperCase()+s.substring(1)).join(' ');
        })
        .join(', ');
        await axios.get(pokemonSpeciesUrl).then(res=>{
                let description = '';
                res.data.flavor_text_entries.some(flavor=>
                    {
                        if(flavor.language.name === 'en')
                        {
                            description=flavor.flavor_text;
                            return;
                        }
                    });
            
                const femaleRate = res.data['gender_rate'];
                const genderRatioFemale = 12.5 * femaleRate;
                const genderRatioMale = 12.5 * (8 - femaleRate);
                const catchRate = Math.round((100 / 255) * res.data['capture_rate']);
                const eggGroups = res.data['egg_groups'].map(group=>
                    {
                        return group.name.toLowerCase().split(' ')
                        .map(s=>s.charAt(0).toUpperCase()+s.substring(1)).join(' ');
                    })
                .join(', ');
                const hatchSteps = 255*(res.data['hatch_counter']+1);
                this.setState({
                    description,
                    genderRatioFemale,
                    genderRatioMale,
                    catchRate,
                    eggGroups,
                    hatchSteps
                });
            });
            this.setState({
                imageUrl,
                pokemonIndex,
                name,
                types,
                stats:{
                  hp,
                  attack,
                  defence,
                  speed,
                  specialAttack,
                  specialDefence
                },

                height,
                weight,
                abilities,
                evs
              });
            

            
    }
    render() {
        return (
            <div className='col'>
                <div className='card'>
                    <div className='card-header' style={{backgroundColor : '#d30c1d'}} >
                        <div className='row'>
                            <div className="col-5" >
                                <h5 style ={{color:"white" }}>{this.state.pokemonIndex}</h5>
                            </div>
                            <div className="col-7">
                                <div className="float-right">
                                    {
                                        this.state.types.map(type=>(
                                            <span key={type} className="badge badge-pill mr-1  "
                                            style ={{
                                                color:'white',
                                                backgroundColor:`#${Poke_types[type]}`,
                                                border:" 1px solid white"
                                            }} >
                                                {type.toLowerCase().split(' ')
                                                    .map(s=>s.charAt(0).toUpperCase()+s.substring(1)).join(' ')}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className='col-md-3'>
                                <img src={this.state.imageUrl}
                                className="card-img-top rounded mx-auto mt-2"/>
                            </div>
                            <div className="col-md-9">
                                <h4 className="mx-auto">
                                    {this.state.name.toLowerCase().split(' ').map(s=>s.charAt(0).toUpperCase()+s.substring(1)).join(' ')}
                                </h4>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">
                                        HP
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                    width:`${this.state.stats.hp}%`
                                            }} 
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>
                                                    {this.state.stats.hp}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">
                                        Attack
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                    width:`${this.state.stats.attack}%`
                                            }} 
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>
                                                    {this.state.stats.attack}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">
                                        Defense
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                    width:`${this.state.stats.defence}%`
                                            }} 
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>
                                                    {this.state.stats.defence}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">
                                        Speed
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                    width:`${this.state.stats.speed}%`
                                            }} 
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>
                                                    {this.state.stats.speed}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">
                                        SpecialAttack
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                    width:`${this.state.stats.specialAttack}%`
                                            }} 
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>
                                                    {this.state.stats.specialAttack}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">
                                        SpecialDefence
                                    </div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                    width:`${this.state.stats.specialDefence}%`
                                            }} 
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>
                                                    {this.state.stats.specialDefence}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col">
                                    <p className="ml-5 mr-5">
                                        {this.state.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <h5 className="card-body text-center">
                        Profile
                    </h5>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Height:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.height} cm
                                    </h6>
                                </div>
                            </div>  
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Egg Groups:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.eggGroups} 
                                    </h6>
                                </div>
                            </div>  
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Weight:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.weight} kg
                                    </h6>
                                </div>
                            </div>  
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Abilities:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.abilities} 
                                    </h6>
                                </div>
                            </div>  
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Catch Rate:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.catchRate} %
                                    </h6>
                                </div>
                            </div>  
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Harch Steps:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.hatchSteps} 
                                    </h6>
                                </div>
                            </div>  
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        Gender Ratio:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <div className="progress">
                                        <div
                                            class="progress-bar"
                                            role="progressbar"
                                            style={{
                                            width: `${this.state.genderRatioFemale}%`,
                                            backgroundColor: '#c2185b'
                                            }}
                                           
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        > 
                                            <small>{this.state.genderRatioFemale}%</small>
                                        </div>
                                        <div
                                            class="progress-bar"
                                            role="progressbar"
                                            style={{
                                            width: `${this.state.genderRatioMale}%`,
                                            backgroundColor: '#1976D2'
                                            }}
                                            aria-valuenow={this.state.genderRatioMale}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        > 
                                            <small>{this.state.genderRatioMale}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <h6 className="float-right">
                                        EVs:
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="float-left">
                                        {this.state.evs} 
                                    </h6>
                                </div>
                            </div>  
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        )
    }
}
