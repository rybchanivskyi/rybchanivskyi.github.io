import React, { Component } from 'react'
import styled from 'styled-components';


export default class NavBar extends Component {
    render() {
        return (
            <div>
                <nav className = "navbar navbar-expand-nd navbar-dark bg-ligth fixed-top">
                    <a href="" className='navbar-brand col-sm-3 col-mid-2 mr-0 align-itmes-center' >Pokedex </a>
                </nav>
            </div>
            
        )
    }
}
