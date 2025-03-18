
import HeroSection from './HeroSection'
import PopularItems from './PopularItems'
import WhatWeServe from './WhatWeServe'
import CustomerReview from './CustomerReview'
import MobileApp from './MobileApp'
import { useEffect } from 'react'

const LandingPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div>
            <HeroSection />
            <PopularItems />
            <WhatWeServe />
            <CustomerReview />
            <MobileApp />
        </div>
    )
}

export default LandingPage
