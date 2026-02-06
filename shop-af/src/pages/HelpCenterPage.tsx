import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Bug,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  HelpCircle,
  CreditCard,
  Palette,
  Link2,
  ShieldCheck
} from 'lucide-react'
import Navbar from '../components/Navbar'

type FeedbackType = 'suggestion' | 'bug'

interface FeedbackForm {
  type: FeedbackType
  subject: string
  message: string
  email: string
}

const faqs = [
  {
    question: 'How do I get started with AlleyLink?',
    answer: 'Sign up for a free account, claim your unique link (alleylink.com/u/yourname), add your affiliate products, and share your link with your audience. It takes less than 5 minutes to set up!',
    icon: HelpCircle
  },
  {
    question: 'How do I add affiliate products?',
    answer: 'From your Dashboard, click "Add Product" and paste your affiliate link. Add a title, description, image, and category tags. Your product will appear on your public storefront immediately.',
    icon: Link2
  },
  {
    question: 'What are the subscription plans?',
    answer: 'We offer three tiers: Free (up to 9 products), Basic ($2.99/mo, up to 100 products with custom branding), and Pro ($4.99/mo, unlimited products with analytics and priority support).',
    icon: CreditCard
  },
  {
    question: 'How do I customize my storefront?',
    answer: 'Go to your Dashboard and click "Customize Profile". You can change your background, colors, fonts, card styles, and more. Pro users get access to advanced themes and glass effects.',
    icon: Palette
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from your Dashboard settings. Your subscription will remain active until the end of your current billing period. No hidden fees or cancellation penalties.',
    icon: CreditCard
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use Supabase for secure authentication and data storage. All connections are encrypted with HTTPS. We never sell your personal data to third parties.',
    icon: ShieldCheck
  }
]

export default function HelpCenterPage() {
  const { user, profile } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    type: 'suggestion',
    subject: '',
    message: '',
    email: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          type: feedbackType,
          subject: feedbackForm.subject,
          message: feedbackForm.message,
          email: feedbackForm.email || (user ? profile?.username + '@user' : 'anonymous'),
          user_id: user?.id || null
        })

      if (error) {
        // If the feedback table doesn't exist yet, fall back to mailto
        window.location.href = `mailto:support@alleylink.com?subject=${encodeURIComponent(
          `[${feedbackType === 'bug' ? 'Bug Report' : 'Suggestion'}] ${feedbackForm.subject}`
        )}&body=${encodeURIComponent(feedbackForm.message)}`
        return
      }

      setSubmitted(true)
      setFeedbackForm({ type: 'suggestion', subject: '', message: '', email: '' })
    } catch {
      // Fallback to mailto
      window.location.href = `mailto:support@alleylink.com?subject=${encodeURIComponent(
        `[${feedbackType === 'bug' ? 'Bug Report' : 'Suggestion'}] ${feedbackForm.subject}`
      )}&body=${encodeURIComponent(feedbackForm.message)}`
    } finally {
      setSubmitting(false)
    }
  }

  const resetFeedback = () => {
    setFeedbackType(null)
    setSubmitted(false)
    setSubmitError('')
    setFeedbackForm({ type: 'suggestion', subject: '', message: '', email: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Got questions? We've got answers. Can't find what you need? Reach out to us directly.
            </p>
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white text-center">
            <Mail className="w-10 h-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
            <p className="text-blue-100 mb-4">
              Our support team is here for you. Send us an email and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:support@alleylink.com"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span>support@alleylink.com</span>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <faq.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{faq.question}</span>
                    </div>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section - Suggestion Box & Bug Report */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
              Share Your Feedback
            </h2>

            {!feedbackType && !submitted ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Suggestion Box Card */}
                <button
                  onClick={() => setFeedbackType('suggestion')}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-left hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-7 h-7 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Suggestion Box</h3>
                  <p className="text-gray-600">
                    Have an idea for a new feature or improvement? We'd love to hear it! Your feedback shapes the future of AlleyLink.
                  </p>
                </button>

                {/* Bug Report Card */}
                <button
                  onClick={() => setFeedbackType('bug')}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-left hover:border-red-500 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Bug className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Report a Bug</h3>
                  <p className="text-gray-600">
                    Found something that isn't working right? Let us know so we can fix it. Please include as much detail as possible.
                  </p>
                </button>
              </div>
            ) : submitted ? (
              /* Success State */
              <div className="bg-white rounded-2xl border-2 border-green-200 p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your {feedbackType === 'bug' ? 'bug report' : 'suggestion'} has been submitted. We appreciate your feedback!
                </p>
                <button
                  onClick={resetFeedback}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Submit another
                </button>
              </div>
            ) : (
              /* Feedback Form */
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {feedbackType === 'suggestion' ? (
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <Bug className="w-6 h-6 text-red-600" />
                    )}
                    <h3 className="text-xl font-bold text-gray-900">
                      {feedbackType === 'suggestion' ? 'Share a Suggestion' : 'Report a Bug'}
                    </h3>
                  </div>
                  <button
                    onClick={resetFeedback}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  {!user && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email (optional)
                      </label>
                      <input
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">So we can follow up if needed</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={feedbackForm.subject}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={feedbackType === 'bug' ? 'Brief description of the bug' : 'What\'s your idea?'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {feedbackType === 'bug' ? 'Steps to Reproduce / Details' : 'Tell us more'}
                    </label>
                    <textarea
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={5}
                      placeholder={
                        feedbackType === 'bug'
                          ? 'What happened? What did you expect to happen? What browser are you using?'
                          : 'Describe your idea in detail. How would it help you?'
                      }
                      required
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                      feedbackType === 'bug'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Submit'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
