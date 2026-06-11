'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { countryCodes } from '@/lib/countryCodes';
import { sendMembershipEmail } from '@/actions/frontend-actions/membership-form-actions/membership-form';

interface MembershipFormData {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  areaOfInterest: string;
  message: string;
}

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function MembershipForm() {
  const [formData, setFormData] = useState<MembershipFormData>({
    fullName: '',
    countryCode: '+256',
    phoneNumber: '',
    email: '',
    areaOfInterest: 'Volunteer',
    message: '',
  });

  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: '',
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormState({
      status: 'loading',
      message: '',
    });

    try {
      const result = await sendMembershipEmail(formData);

      if (result.success) {
        setFormState({
          status: 'success',
          message:
            result.message ||
            'Membership application submitted successfully!',
        });

        setFormData({
          fullName: '',
          countryCode: '+256',
          phoneNumber: '',
          email: '',
          areaOfInterest: 'Volunteer',
          message: '',
        });

        setTimeout(() => {
          setFormState({
            status: 'idle',
            message: '',
          });
        }, 10000);
      } else {
        setFormState({
          status: 'error',
          message:
            result.error ||
            'Failed to submit membership application',
        });
      }
    } catch (error) {
      console.error(error);

      setFormState({
        status: 'error',
        message:
          'An unexpected error occurred. Please try again.',
      });
    }
  };

  // SUCCESS SCREEN
  if (formState.status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4">
        <div className="mb-6">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto animate-bounce" />
        </div>

        <h2 className="text-3xl font-bold text-primary mb-3">
          Thank You!
        </h2>

        <p className="text-lg text-foreground mb-2">
          {formState.message}
        </p>

        <p className="text-muted-foreground mb-8">
          We've received your membership application and will get back to
          you shortly.
        </p>

        <button
          onClick={() => {
            setFormState({
              status: 'idle',
              message: '',
            });

            setFormData({
              fullName: '',
              countryCode: '+256',
              phoneNumber: '',
              email: '',
              areaOfInterest: 'Volunteer',
              message: '',
            });
          }}
          className="px-6 py-3 cursor-pointer bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-balance">
            Become a Member Today
          </h2>

          <p className="text-muted-foreground mb-8 text-center">
            Join Benevora Initiative and help us create lasting impact in
            communities.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ERROR MESSAGE */}
            {formState.status === 'error' && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  {formState.message}
                </p>
              </div>
            )}

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={formState.status === 'loading'}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
              />
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  disabled={formState.status === 'loading'}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-28 disabled:opacity-50"
                >
                  {countryCodes.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                    >
                      {country.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={formState.status === 'loading'}
                  placeholder="Phone number"
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                Email Address <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={formState.status === 'loading'}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
              />
            </div>

            {/* AREA OF INTEREST */}
            <div>
              <label
                htmlFor="areaOfInterest"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                Area of Interest <span className="text-red-500">*</span>
              </label>

              <select
                id="areaOfInterest"
                name="areaOfInterest"
                value={formData.areaOfInterest}
                onChange={handleChange}
                required
                disabled={formState.status === 'loading'}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
              >
                <option value="Volunteer">Volunteer</option>
                <option value="Donor">Donor</option>
                <option value="Partner">Partner</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-2 text-foreground"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                disabled={formState.status === 'loading'}
                placeholder="Tell us about your interests, skills, or why you want to join us..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={formState.status === 'loading'}
              className="w-full cursor-pointer px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formState.status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Sending Application...
                </>
              ) : (
                'Submit Membership Application'
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. Your information will only be used
              to process your membership application.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

