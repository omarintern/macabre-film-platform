import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import WorkSubmissionForm, { Work } from '../../../components/features/WorkSubmissionForm';

function getJWTSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwtSecret;
}

export default async function SubmitPage() {
  // Check authentication and role
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded: { userId: string; email: string; role: string };
  try {
    const jwtSecret = getJWTSecret();
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    redirect('/login');
  }

  // Check if user has CREATOR role
  if (!decoded || decoded.role !== 'CREATOR') {
    redirect('/');
  }

  const handleSubmissionSuccess = (work: Work) => {
    // This function runs on the client side after successful submission
    console.log('Work submitted successfully:', work);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Submit New Work
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your creative work with the community. Whether it&apos;s a synopsis, 
            scene description, or other creative content, showcase your talent here.
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500">
                  Submit Work
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Form Container */}
        <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
          <WorkSubmissionForm onSubmissionSuccess={handleSubmissionSuccess} />
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Submission Guidelines
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span>Keep your work under 1,000 characters for optimal readability</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span>Choose the most appropriate classification for your work</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span>Use relevant tags to help others discover your work</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span>Ensure your content is original and appropriate for the platform</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
