import { useState } from 'react'

export default function Contact() {
    const [formData, setFormData] = useState({
        email: '',
        message: '',
    })

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact us</h1>
        <form className="mt-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Email
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Message
                <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message"
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                />
            </label>
            <button
                type="submit"
                className="mt-4 bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800"
            >
                Send
            </button>
        </form>
        <p className="mt-4 text-gray-700">Our customer support team is available Monday to Friday, 9am to 5pm (EST). We strive to respond to all inquiries within 24-48 hours.</p>
        <p className="mt-4 text-gray-700">Thank you for choosing Kombucha Party! We look forward to assisting you.</p>
    </div>
  )
}
