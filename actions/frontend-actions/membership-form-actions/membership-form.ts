'use server';

import { MembershipFormEmailTemplate } from '@/components/frontend-components/membership-form/membership-form-email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface MembershipFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  areaOfInterest: string;
  message: string;
}

export async function sendMembershipEmail(data: MembershipFormData) {
  try {
    // Validate required fields
    if (
      !data.fullName ||
      !data.email ||
      !data.phoneNumber ||
      !data.areaOfInterest
    ) {
      return {
        success: false,
        error: 'Please fill in all required fields',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // Send email
    const { data: responseData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['clancyro1789@gmail.com'], // Change to your email
      replyTo: data.email,
      subject: `New Membership Application - ${data.fullName}`,
      react: MembershipFormEmailTemplate({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
        areaOfInterest: data.areaOfInterest,
        message: data.message,
      }),
    });

    if (error) {
      console.error('Resend error:', error);

      return {
        success: false,
        error: 'Failed to send application. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Membership application submitted successfully!',
      id: responseData?.id,
    };
  } catch (error) {
    console.error('Error sending membership email:', error);

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}