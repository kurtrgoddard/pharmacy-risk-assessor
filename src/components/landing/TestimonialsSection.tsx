
import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      title: "PharmD, Clinical Manager",
      pharmacy: "Downtown Pharmacy, Toronto",
      content: "PharmAssess has transformed our workflow. What used to take 30 minutes now takes 2. The NAPRA compliance checking gives us confidence in every assessment.",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Michael Rodriguez",
      title: "Pharmacy Owner",
      pharmacy: "Central Compounding, Calgary",
      content: "The time savings are incredible. We're processing 3x more compound orders with the same staff. The automated risk classification is spot-on every time.",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Dr. Jennifer Walsh",
      title: "Director of Pharmacy",
      pharmacy: "Maritime Health Solutions, Halifax",
      content: "Finally, a tool that understands Canadian pharmacy regulations. The PDF reports are professional and ready for regulatory review. Couldn't be happier.",
      rating: 5,
      image: "/api/placeholder/64/64"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Trusted by Pharmacists Across Canada
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what your colleagues are saying about PharmAssess
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-blue-300" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                  <div className="text-sm text-blue-600">{testimonial.pharmacy}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">500+ Active Pharmacists</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">10+ Provinces Covered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
