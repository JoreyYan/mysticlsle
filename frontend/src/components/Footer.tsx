'use client'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export function ContactSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Us */}
          <div>
            <h5 className="font-semibold text-sm uppercase mb-4">{t.frontend.footer.contactUs}</h5>
            <div className="text-sm space-y-2">
              <p className="uppercase">{t.frontend.footer.emailUs} <a href="mailto:help@openme.com" className="underline">help@openme.com</a></p>
              <p className="uppercase">{t.frontend.footer.responseTime}</p>
              <p className="uppercase">{t.frontend.footer.weekdays}</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center">
            <h5 className="font-semibold mb-4">{t.frontend.footer.newsletter}</h5>
            <p className="text-sm mb-4 uppercase">{t.frontend.footer.newsletterDesc}</p>
            <Button className="bg-pink-200 text-gray-900 px-6 py-2 font-semibold">
              {t.frontend.footer.subscribe}
            </Button>
          </div>

          {/* Follow Us */}
          <div>
            <h5 className="font-semibold text-sm uppercase mb-4">{t.frontend.footer.followUs}</h5>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/openme/" target="_blank" rel="noopener noreferrer">
                <div className="w-6 h-6 bg-white text-gray-900 flex items-center justify-center text-sm">📸</div>
              </a>
              <a href="https://www.tiktok.com/@openme" target="_blank" rel="noopener noreferrer">
                <div className="w-6 h-6 bg-white text-gray-900 flex items-center justify-center text-sm">🎵</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-semibold mb-4">{t.frontend.footer.service}</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="hover:underline">{t.frontend.footer.contactLink}</a></li>
              <li><a href="/customization" className="hover:underline">{t.frontend.footer.customization}</a></li>
              <li><a href="/faq" className="hover:underline">{t.frontend.footer.faq}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">{t.frontend.footer.order}</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="/return-order" className="hover:underline">{t.frontend.footer.returnOrder}</a></li>
              <li><a href="/payment" className="hover:underline">{t.frontend.footer.payment}</a></li>
              <li><a href="/shipping" className="hover:underline">{t.frontend.footer.shipping}</a></li>
              <li><a href="/track-order" className="hover:underline">{t.frontend.footer.trackOrder}</a></li>
              <li><a href="/refund" className="hover:underline">{t.frontend.footer.refund}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">{t.frontend.footer.aboutUs}</h5>
            <ul className="space-y-2 text-sm uppercase">
              <li><a href="/about?menu=brand-history" className="hover:underline">{t.frontend.footer.brandHistory}</a></li>
              <li><a href="/about?menu=founder" className="hover:underline">{t.frontend.footer.founder}</a></li>
              <li><a href="/about?menu=manufacturing" className="hover:underline">{t.frontend.footer.manufacturing}</a></li>
              <li><a href="/about?menu=sizing" className="hover:underline">{t.frontend.footer.sizing}</a></li>
              <li><a href="/about?menu=influencer" className="hover:underline">{t.frontend.footer.influencer}</a></li>
              <li><a href="/about?menu=social" className="hover:underline">{t.frontend.footer.social}</a></li>
              <li><a href="/about?menu=wholesale" className="hover:underline">{t.frontend.footer.wholesale}</a></li>
              <li><a href="/about?menu=newsletter" className="hover:underline">{t.frontend.footer.newsletterBenefits}</a></li>
              <li><a href="https://www.instagram.com/mysticisle/" target="_blank" className="hover:underline">{t.frontend.footer.instagram}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">{t.frontend.footer.legal}</h5>
            <ul className="space-y-2 text-sm uppercase">
              <li><a href="/legal?search=terms" className="hover:underline">{t.frontend.footer.terms}</a></li>
              <li><a href="/legal?search=privacy" className="hover:underline">{t.frontend.footer.privacy}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            Copyright © 2025 OpenME Inc. {t.frontend.footer.copyright}.
          </p>
        </div>
      </div>
    </footer>
  )
}
