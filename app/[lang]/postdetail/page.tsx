'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import Image from 'next/image';
import Footer from '@/components/footer/footer';

export default function ServicesPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [, lang] = usePathname().split('/');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);


  return (
    <>
      <div className="BodyPostDetail">
        <div className="pt-20 pb-10 px-6 md:px-12 xl:px-[120px] 2xl:px-[160px]">
          <h1 className="text-3xl md:text-4xl font-medium text-center">
            What is Knowledge Base Architecture?
          </h1>
          <div className="flex justify-center pt-4">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
              <div className="flex items-center">
                <Image src="/images/woman.jpg" alt="avatar" width={32} height={32} className="rounded-full mr-2" />
                <span className="text-black">Sophia Willams</span>
              </div>
              <div className="flex items-center">
                <Image src="/images/icons/clock.png" alt="read" width={20} height={20} className="mr-2" />
                <span className="text-gray-500">9 min read</span>
              </div>
              <div className="flex items-center">
                <Image src="/images/icons/calendar.svg" alt="date" width={20} height={20} className="mr-2" />
                <span className="text-gray-500">Feb 9, 2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-12 xl:px-[120px]">
          <div className="rounded-lg">
            <Image
              src="/images/bg1.png"
              alt="post img"
              width={1000}
              height={1000}
              className="rounded-[1.5rem] w-full mx-auto"
            />

            <div className="flex flex-col lg:flex-row gap-10 py-10">
              <aside className="w-full lg:w-60 flex-shrink-0">
                <div className="flex flex-col gap-4 mt-8 border-t border-gray-300 pt-8 text-base font-medium">
                  <div className="text-[#335CFF]">Table of contents</div>
                  <div>Introduction</div>
                  <div>Software and tools</div>
                  <div>Other resources</div>
                  <div>Conclusion</div>
                </div>

                <div className="flex gap-4 border-t border-gray-300 pt-8 mt-12 cursor-pointer">
                  {["links", "x", "facebook", "linkedIn"].map((icon, idx) => (
                    <Image
                      key={idx}
                      src={`/images/icons/${icon}.svg`}
                      alt={icon}
                      width={20}
                      height={20}
                      className="border border-gray-300 w-10 h-10 rounded-md m-auto"
                    />
                  ))}
                </div>
              </aside>

              <article className="flex-1">
                <p className="pb-5">
                  Do you ever feel like there's a missing puzzle piece in your knowledge base
                  architecture? If so, you're not alone. The fact is, many organizations struggle
                  to identify the right steps for building an effective knowledge base architecture—
                  or even knowing what it is!
                  <br />
                  <br />
                  Whether you're looking for an introduction to the concept of knowledge base
                  architecture or comprehensive advice on how to achieve success when assembling
                  yours from scratch, this blog post will provide practical strategies and use cases
                  that can help. So if you're ready to start optimizing your online presence with
                  helpful information and insights, read on!
                </p>

                <h2 className="text-3xl md:text-[40px] font-medium py-5">
                  What is information architecture?
                </h2>

                <p className="pb-5">
                  Do you ever feel like there's a missing puzzle piece in your knowledge base
                  architecture? If so, you're not alone. The fact is, many organizations struggle
                  to identify the right steps for building an effective knowledge base architecture—
                  or even knowing what it is!
                  <br />
                  <br />
                  Whether you're looking for an introduction to the concept of knowledge base
                  architecture or comprehensive advice on how to achieve success when assembling
                  yours from scratch, this blog post will provide practical strategies and use cases
                  that can help. So if you're ready to start optimizing your online presence with
                  helpful information and insights, read on!
                </p>

                <h2 className="text-3xl md:text-[40px] font-medium pb-5">Accessibility</h2>

                <p className="pb-5">
                  A well-designed knowledge base should prioritize accessibility, and one effective
                  way to achieve this is by incorporating text-to-speech (TTS) technology. Tools like
                  Text.com's Text-to-Speech enable users to listen to content instead of reading it,
                  making information more accessible to individuals with visual impairments, learning
                  difficulties, or those who prefer auditory learning.
                </p>

                <Image
                  src="/images/bg1.png"
                  alt="comment post"
                  width={1000}
                  height={1000}
                  className="rounded-[1.5rem] my-5"
                />

                <p className="my-5">
                  By integrating TTS into your knowledge base architecture, you enhance user
                  engagement and ensure that your content is easily consumed by a diverse audience.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
