"use client"

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

const FeaturesComponent: React.FC = () => {
  const features = [
    {
      title: "DeepSeek",
      description: "currently the best model of LLM api key for Streaming.",
      image: (
        <Image
        src={"/ds.jpg"}
        alt={` image`}
        width={400}
        height={300}
        className="w-16 h-16 object-cover transition-transform duration-300 hover:scale-105"
      />
      ),
    },
    {
      title: "Jina",
      description: "With One Million free token for starters, Jina is the go to platform for Web Scraping.",
      image: (
        <Image
        src={"/jina.jpg"}
        alt={` image`}
        width={400}
        height={300}
        className="w-20 h-16 object-cover transition-transform duration-300 hover:scale-105"
      />
      ),
    },
    {
      title: " DataStax",
      description: "The go to Data Base for storing and retrieving stored vector embeddings for Rag Application with a very generous plan for starters.",
      image: (
        <Image
        src={"/dstax.jpg"}
        alt={` image`}
        width={400}
        height={300}
        className="w-16 h-16 object-cover transition-transform duration-300 hover:scale-105"
      />
      ),
    },
  ]

  const featureRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('feature-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
  
    // Copy the current refs to a local variable
    const currentRefs = featureRefs.current;
  
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
  
    return () => {
      // Use the local variable in the cleanup
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []); 

  return (
    <div className="container mx-auto px-4 py-16 bg-white rounded-md">
      <h2 className="cursor-pointer text-4xl font-bold text-center mb-16 text-black relative inline-block left-1/2 transform -translate-x-1/2 group">
        Whats under The Hood of
        <span className="font-[family-name:var(--ProtestGuerrilla)] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        {` Sspot1 Analytic`}
        </span>
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-600 to-purple-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </h2>
      <div className="grid gap-12 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el: HTMLDivElement | null) =>{if (el) featureRefs.current[index] = el} }
            className={"bg-white rounded-lg p-8 text-center transition-all duration-300 hover:shadow-2xl transform hover:translate-y-2 feature-card"}
          >
            <div className="w-20 h-20 mx-auto mb-6 overflow-hidden rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
              {feature.image}
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-black">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .feature-card {
          opacity: 0;
        }
        .feature-visible {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

FeaturesComponent.displayName = "FeaturesComponent"
export default FeaturesComponent