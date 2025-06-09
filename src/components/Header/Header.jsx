import React from 'react'
import './Header.css'

// eslint-disable-next-line react/prop-types
const Header = ({ text }) => (
  <section className="widget-title__wrapper">
    <p className="widget__title">
        <span>{text}</span>
    </p>
    <div className='section__bar'/>
  </section>
)

export default Header
