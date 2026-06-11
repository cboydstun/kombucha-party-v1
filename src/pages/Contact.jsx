import { useState } from 'react'

import ContactForm from '../components/ContactForm.jsx'

export default function Contact() {
    const [formData, setFormData] = useState({
        email: '',
        message: '',
    })

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact us</h1>
        <p className="mt-4 text-gray-700">Have questions or feedback? We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.</p>
        <div className="mt-6">
            <ContactForm />
        </div>
    </div>
  )
}
