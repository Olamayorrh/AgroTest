import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const TermsPage = () => {
  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="mb-6">
        <Link to="/" className="text-sm text-neutral-500 hover:text-primary-700 flex items-center gap-1 font-medium mb-3">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Terms of Service (Demo)
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Last revised: October 2026</p>
      </div>

      <div className="card card-body bg-white border border-neutral-200/90 space-y-5 text-sm text-neutral-600 leading-relaxed">
        <div className="p-3.5 bg-primary-50 rounded-2xl border border-primary-200 text-xs text-primary-900 font-medium">
          Note: AgroShare is currently demonstrated as a concept prototype. All equipment listings, availability statuses, ratings, and rates are sample data.
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Platform Nature</h2>
          <p>
            AgroShare acts as an informational matchmaker connecting farm owners with machinery hosts. Machinery specifications and condition reports are provided by listed hosts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Rental Transactions & Payment</h2>
          <p>
            In this prototype release, no real electronic funds are debited. All transactions simulate local settlement and direct farmer-host agreements upon equipment inspection.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Operation & Safety</h2>
          <p>
            Equipment hirers and machine operators must follow safety guidelines during field operations including wearing proper PPE and maintaining standard tractor clearance.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
