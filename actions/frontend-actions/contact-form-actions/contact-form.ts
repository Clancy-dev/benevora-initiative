'use server';

import { ContactFormEmailTemplate } from '@/components/frontend-components/contact-form-components/contact-form-email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.message) {
      return {
        success: false,
        error: 'All fields are required',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format',
      };
    }

    // Send email using Resend
    const { data: responseData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['clancyro1789@gmail.com'], 
      replyTo: data.email,
      subject: `New Contact Form Message from ${data.name}`,
      react: ContactFormEmailTemplate({
        firstName: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: 'Failed to send email. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Your message has been sent successfully!',
      id: responseData?.id,
    };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
