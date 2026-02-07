import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow p-5 md:p-6">
            <h1 className="text-fluid-xl font-bold text-gray-900 mb-1">Terms of Service</h1>
            <p className="text-gray-500 mb-6">Last updated: February 5, 2025</p>

            <div className="prose prose-gray max-w-none space-y-4">
              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using AlleyLink ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. AlleyLink reserves the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">2. Description of Service</h2>
                <p className="text-gray-600 leading-relaxed">
                  AlleyLink provides a platform for users to create personalized affiliate marketing storefronts. Users can curate product listings, customize their storefront appearance, and share affiliate links with their audience. The Service includes free and paid subscription tiers with varying feature access.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">3. Account Registration</h2>
                <p className="text-gray-600 leading-relaxed">
                  To use certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">4. User Content</h2>
                <p className="text-gray-600 leading-relaxed">
                  You retain ownership of content you submit to AlleyLink, including product listings, descriptions, and images. By posting content, you grant AlleyLink a non-exclusive, worldwide license to display, distribute, and promote your content in connection with the Service. You are solely responsible for the accuracy, legality, and appropriateness of all content you post.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">5. Affiliate Links & Compliance</h2>
                <p className="text-gray-600 leading-relaxed">
                  Users are responsible for ensuring their affiliate links and marketing practices comply with all applicable laws, including the FTC's endorsement guidelines. You must disclose your affiliate relationships to your audience. AlleyLink is not responsible for the products or services linked through your storefront.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">6. Prohibited Conduct</h2>
                <p className="text-gray-600 leading-relaxed">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2 ml-4">
                  <li>Use the Service for any unlawful purpose or to promote illegal products</li>
                  <li>Post misleading, fraudulent, or deceptive content</li>
                  <li>Impersonate another person or entity</li>
                  <li>Attempt to circumvent subscription limits or manipulate click analytics</li>
                  <li>Upload malware, viruses, or harmful code</li>
                  <li>Scrape, crawl, or otherwise collect data from the Service without permission</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">7. Subscriptions & Payments</h2>
                <p className="text-gray-600 leading-relaxed">
                  Paid subscriptions are billed monthly through Stripe. By subscribing, you authorize recurring charges. You may cancel at any time, and your subscription will remain active until the end of the current billing period. Refunds are handled on a case-by-case basis. AlleyLink reserves the right to change pricing with 30 days' notice.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">8. Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  AlleyLink may suspend or terminate your account at any time for violation of these terms or for any conduct that AlleyLink determines is harmful to other users or the Service. Upon termination, your right to use the Service ceases immediately. You may also delete your account at any time by contacting support.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">9. Disclaimer of Warranties</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. AlleyLink does not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for any loss of data, revenue, or profits arising from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">10. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, AlleyLink shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service. Our total liability shall not exceed the amount you paid to AlleyLink in the twelve months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">11. Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. We collect and process personal data as necessary to operate the Service, including email addresses, profile information, and usage analytics. We do not sell your personal data to third parties. For questions about data handling, contact us at{' '}
                  <a href="mailto:support@alleylink.com" className="text-blue-600 hover:text-blue-700">
                    support@alleylink.com
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-fluid-base font-semibold text-gray-900 mb-2">12. Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms, please contact us at{' '}
                  <a href="mailto:support@alleylink.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    support@alleylink.com
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
