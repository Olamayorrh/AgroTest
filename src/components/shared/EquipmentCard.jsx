import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Check, X, Clock } from 'lucide-react';
import { formatPrice, truncate } from '../../utils/formatters';
import { getProximityLabel } from '../../utils/geo';
import Button from '../ui/Button';

/**
 * Equipment listing card for the marketplace.
 */
const EquipmentCard = ({ equipment, userLocation, className = '' }) => {
  const {
    id,
    name,
    type,
    lga,
    state,
    country,
    pricePerDay,
    pricePerHour,
    pricePerAcre,
    billingUnit,
    operatorIncluded,
    availability,
    images,
    rating,
    reviewCount,
    currencySymbol = '₦',
  } = equipment;

  const mainImage = images?.[0];
  const price = pricePerDay || pricePerHour || pricePerAcre || 0;
  const proximityLabel = getProximityLabel(equipment, userLocation);

  return (
    <div className={`card card-hover flex flex-col overflow-hidden ${className}`}>
      {/* Image */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="8" fill="#f5f5f0"/>
              <path d="M16 44V28l12-8 20 8v16H16Z" stroke="#d4d4c5" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="44" r="4" stroke="#d4d4c5" strokeWidth="2" fill="none"/>
              <circle cx="44" cy="44" r="4" stroke="#d4d4c5" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        )}
        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          {availability === 'available' ? (
            <span className="badge bg-primary-600 text-white text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Available
            </span>
          ) : (
            <span className="badge bg-neutral-700 text-white text-xs">
              Unavailable
            </span>
          )}
        </div>
        {/* Proximity label */}
        {proximityLabel && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-accent-400 text-neutral-900 text-xs font-semibold">
              📍 {proximityLabel}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Type badge */}
        <span className="badge-gray self-start">{type}</span>

        {/* Name */}
        <h3 className="font-semibold text-neutral-900 text-base leading-snug">
          {truncate(name, 60)}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
          <MapPin size={14} className="text-primary-500 flex-shrink-0" />
          <span className="truncate">
            {[lga, state].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Operator */}
        <div className="flex items-center gap-1.5 text-sm">
          {operatorIncluded ? (
            <>
              <Check size={14} className="text-primary-600" />
              <span className="text-primary-700 font-medium">Operator included</span>
            </>
          ) : (
            <>
              <X size={14} className="text-neutral-400" />
              <span className="text-neutral-400">No operator</span>
            </>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 text-sm">
            <Star size={14} className="text-accent-400 fill-accent-400" />
            <span className="font-medium text-neutral-700">{rating}</span>
            <span className="text-neutral-400">({reviewCount} reviews)</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-neutral-100">
          <div>
            <span className="text-xl font-bold text-primary-700">
              {currencySymbol}{price.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 ml-1">/{billingUnit?.replace('per ', '') || 'day'}</span>
          </div>
          <Link to={`/equipment/${id}`}>
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
