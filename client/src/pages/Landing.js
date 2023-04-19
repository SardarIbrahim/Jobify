import React from 'react'

import styled from 'styled-components'

import Wrapper from '../assets/wrappers/LandingPage'

import { Logo } from '../components'
import Main from '../assets/images/main.svg'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        {/* info */}
        <div className='info'>
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
            bottle single-origin coffee chia. Aesthetic post-ironic venmo,
            quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
            narwhal.
          </p>
          <Link to={'/register'} className='btn btn-hero'>
            Login/Register
          </Link>
        </div>
        <div>
          <img src={Main} alt='job hunt' className='img main-img' />
        </div>
      </div>
    </Wrapper>
  )
}

const WrapperExample = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }

  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }

  h1 {
    font-weight: 700;
    span {
      color: var(--primay-500);
    }
  }

  p {
    color: var(--gray-600);
  }

  .main-img {
    display: none;
    max-width: 100%;
  }

  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .main-img {
      display: block;
    }
  }
`

export default Landing
