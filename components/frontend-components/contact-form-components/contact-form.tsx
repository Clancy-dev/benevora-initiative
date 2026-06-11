'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContactEmail } from '@/actions/frontend-actions/contact-form-actions/contact-email';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });

    try {
      const result = await sendContactEmail(formData);

      if (result.success) {
        setFormState({
          status: 'success',
          message: result.message || 'Message sent successfully!',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        // Auto-reset success message after 5 seconds
        setTimeout(() => {
          setFormState({ status: 'idle', message: '' });
        }, 15000);
      } else {
        setFormState({
          status: 'error',
          message: result.error || 'Failed to send message',
        });
      }
    } catch (error) {
      setFormState({
        status: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  // Success state
  if (formState.status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4">
        <div className="mb-6">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-3">Thank You!</h2>
        <p className="text-lg text-foreground mb-2">
          {formState.message}
        </p>
        <p className="text-muted-foreground mb-8">
          We&apos;ve received your message and will get back to you shortly.
        </p>
        <button
          onClick={() => {
            setFormState({ status: 'idle', message: '' });
            setFormData({
              name: '',
              email: '',
              phone: '',
              message: '',
            });
          }}
          className="px-6 py-3 cursor-pointer bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-2">Send us a Message</h2>
      <p className="text-muted-foreground mb-8">
        Have a question or want to learn more? We&apos;d love to hear from you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message */}
        {formState.status === 'error' && (
          <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{formState.message}</p>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            disabled={formState.status === 'loading'}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            disabled={formState.status === 'loading'}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+256 123 456 789"
            required
            disabled={formState.status === 'loading'}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            placeholder="Tell us about your inquiry or how we can help you..."
            required
            disabled={formState.status === 'loading'}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formState.status === 'loading'}
          className="w-full cursor-pointer px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {formState.status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Your information will only be used to respond
          to your inquiry.
        </p>
      </form>
    </div>
  );
}
