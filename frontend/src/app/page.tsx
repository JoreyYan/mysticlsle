'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/FallbackImage'
import { AnnouncementBar, Header } from '@/components/Header'
import { ContactSection, Footer } from '@/components/Footer'

// Main Banner Section
function MainBanner() {
  return (
    <section className="relative">
      {/* Desktop Banner */}
      <div className="hidden md:block">
        <div className="relative">
          <FallbackImage
            src="/images/halloween-banner.webp"
            alt="Boo-tiful looks, killer vibes"
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="text-center space-x-4">
              <Button className="bg-black text-white px-8 py-3 text-sm font-semibold mr-4 mb-4">
                COSTUMES
              </Button>
              <Button className="bg-black text-white px-8 py-3 text-sm font-semibold mb-4">
                ACCESSORIES
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden">
        <div className="relative">
          <FallbackImage
            src="/images/halloween-banner.webp"
            alt="Boo-tiful looks, killer vibes"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  )
}

// Secondary Banner
function SecondaryBanner() {
  return (
    <section className="my-8">
      {/* Desktop */}
      <div className="hidden md:block">
        <Link href="/collections/sets">
          <FallbackImage
            src="/images/main-character-banner.png"
            alt="For main characters only"
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <Link href="/collections/sets">
          <FallbackImage
            src="/images/main-character-mobile.png"
            alt="Only main character vibes"
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
    </section>
  )
}

// Halloween Shop Section
function HalloweenShop() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left - Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="max-w-md mx-auto lg:mx-0">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
                Halloween Shop Coming Soon...
              </h3>
              <div className="text-gray-700 leading-relaxed mb-8 space-y-2">
                <p>Under neon skies we shine,</p>
                <p>Sequins, sparkles, one-of-a-kind.</p>
                <p>MysticIsle calls — bold and bright,</p>
                <p>Festival queens rule the night.</p>
                <br />
                <p>Halloween whispers, daring, wild,</p>
                <p>Dark with glitter, wicked-styled.</p>
                <p>Costumes glow, the bass beats rave,</p>
                <p>Born to stand out — MysticIsle.</p>
              </div>
              <div className="text-center">
                <Link href="/collections/halloween">
                  <Button className="bg-black text-white px-8 py-3 font-medium">
                    STAY TUNED!
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="lg:w-1/2">
            <FallbackImage
              src="/images/halloween-girl.webp"
              alt="Halloween costume model"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Leg Wear Section
function LegWearSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Pick a Leg Wear to Match!</h3>
          <Link href="/legwear" className="text-gray-600 hover:text-gray-900 underline">
            See full list
          </Link>
        </div>
        {/* Placeholder for slider - would need actual product data */}
        <div className="text-center py-8 text-gray-500">
          <p>Leg wear products carousel would go here</p>
        </div>
      </div>
    </section>
  )
}

// We Ship Global Banner
function GlobalShippingBanner() {
  return (
    <section className="my-8">
      {/* Desktop */}
      <div className="hidden md:block">
        <Link href="/collections/sets">
          <FallbackImage
            src="/images/we-ship-global.png"
            alt="We ship global"
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <Link href="/collections/sets">
          <FallbackImage
            src="/images/we-ship-global-mobile.png"
            alt="We ship global"
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
    </section>
  )
}

// Muses in Motion - Instagram Gallery
function MusesInMotion() {
  const instagramPosts = [
    { username: '@judygrr', image: 'judy.png', link: 'https://www.instagram.com/p/DI0jMP0xu9y/' },
    { username: '@elseanapanzer', image: 'elsea.png', link: 'https://www.instagram.com/p/DH9R_COSeJz/' },
    { username: '@meganmarieee_', image: 'megan.png', link: 'https://www.instagram.com/p/DGgOTSmPyN_/' },
    { username: '@terrx.duonx', image: 'terr.png', link: 'https://www.instagram.com/p/DKfU0SKSpC_/' },
    { username: '@katiepacini', image: 'katie.png', link: 'https://www.instagram.com/p/DKU1ffsO0dv/' },
    { username: '@sarachaee', image: 'sara.png', link: 'https://www.instagram.com/p/DKIDpdmJwFV/' },
    { username: '@hachiekiss', image: 'hachie.png', link: 'https://www.instagram.com/p/DKAeLPZSwsW/' },
    { username: '@emilythebearrr', image: 'emily.png', link: 'https://www.instagram.com/p/DJ2zE9CsQg5/' }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Muses in Motion</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {instagramPosts.map((post, idx) => (
            <div key={idx} className="relative group cursor-pointer">
              <a href={post.link} target="_blank" rel="noopener noreferrer">
                <div className="aspect-[5/7] bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg overflow-hidden">
                  <FallbackImage
                    src={`/images/instagram/${post.image}`}
                    alt={post.username}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-pink-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {post.username}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <MainBanner />
      <SecondaryBanner />
      <HalloweenShop />
      <LegWearSection />
      <GlobalShippingBanner />
      <MusesInMotion />
      <ContactSection />
      <Footer />
    </>
  )
}