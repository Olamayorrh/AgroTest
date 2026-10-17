import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="mb-6">
        <Link to="/" className="text-sm text-neutral-500 hover:text-primary-700 flex items-center gap-1 font-medium mb-3">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Privacy Policy (Demo)
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Last revised: October 2026</p>
      </div>

      <div className="card card-body bg-white border border-neutral-200/90 space-y-5 text-sm text-neutral-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Data Storage</h2>
          <p>
            This demo application stores account information, rental bookings, and farm logs in your browser's local storage (abstracted via an Axios-compatible API service layer).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Location Information</h2>
          <p>
            Geographic parameters (Country, State/Region, and Local Government Area) are used solely to sort machinery by proximity and calculate nearest delivery matches.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Contact Information</h2>
          <p>
            Phone numbers and email addresses entered during registration are retained locally for session simulation and are not shared with third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
