import Link from 'next/link';
import Footer from '@/components/footer/footer';
import Image from 'next/image';
export default function UsingInsightsSection() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-gray-600 mb-8">
        <Link href="/help" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/help/faq/general" className="hover:text-blue-600">
          General
        </Link>
        <span>/</span>
        <span className="text-gray-900">Using the Insights section</span>
      </nav>

      {/* Article Header */}
      <div className="mb-12">
        <h1 className="text-[48px] font-medium mb-4">Using the Insights section</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>9 min read</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Last update: 10.17.2023</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-8">
          Do you ever feel like there's a missing puzzle piece in your knowledge base architecture? If so, you're not
          alone. The fact is, many organizations struggle to identify the right steps for building an effective
          knowledge base architecture-or even knowing what it is!
        </p>

        <h2 className="text-[40px] font-medium mb-6">What is information architecture?</h2>

        <p className="text-gray-600 mb-8">
          Whether you're looking for an introduction to the concept of knowledge base architecture or
          comprehensive advice on how to achieve success when assembling yours from scratch, this blog post will
          provide practical strategies and use cases that can help. So if you're ready to start optimizing your online
          presence with helpful information and insights, read on!
        </p>
        <h2 className="text-[40px] font-medium mb-6">What is information architecture?</h2>

        <p className="text-gray-600 mb-8">
          Whether you're looking for an introduction to the concept of knowledge base architecture or
          comprehensive advice on how to achieve success when assembling yours from scratch, this blog post will
          provide practical strategies and use cases that can help. So if you're ready to start optimizing your online
          presence with helpful information and insights, read on!
        </p>
        <h2 className="text-[40px] font-medium mb-6">Accessibility</h2>

        <p className="text-gray-600 mb-8">
          A well-designed knowledge base should prioritize accessibility, and one effective way to achieve this is by incorporating text-to-speech (TTS) technology. Tools like Text.com's Text-to-Speech enable users to listen to content instead of reading it, making information more accessible to individuals with visual impairments, learning difficulties, or those who prefer auditory learning.
        </p>

        <Image src="/images/bg2.png" className='rounded-[24px] my-8' alt="Image" width={1000} height={1000} />
      </div>
      <p className="text-gray-600 my-8">
        By integrating TTS into your knowledge base architecture, you enhance user engagement and ensure that your content is easily consumed by a diverse audience.
      </p>
      <Footer />
    </div>
  );
} 