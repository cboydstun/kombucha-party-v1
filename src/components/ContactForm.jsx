import React from 'react';
import { useForm } from '@formspree/react';

function ContactForm() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_KEY);

  console.log(state)

  if (state.succeeded) {
      return <p>Thanks for joining!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        id="email"
        type="email" 
        name="email"
        className="rounded-md border border-gray-300 px-3 py-2 font-normal"
      />

      <textarea
        id="message"
        name="message"
        placeholder="Your message"
        className="rounded-md border border-gray-300 px-3 py-2 font-normal"
      />

      <button type="submit" disabled={state.submitting} className="self-start rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 disabled:bg-gray-400">
        Submit
      </button>
    </form>
  );
}


export default ContactForm;