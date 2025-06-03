import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serviceOperations } from '@/utils/supabase/database';
import { Service } from '@/utils/supabase/types';
import * as Breadcrumb from '@/components/ui/breadcrumb';
import {
  RiArrowRightSLine,
  RiHomeSmile2Line,
} from '@remixicon/react';
import { ServiceInfoLeft } from '../../../../components/services/detail/service-info-left';
import { ServiceInfoRight } from '../../../../components/services/detail/service-info-right';
import Translate from '@/components/Translate';

interface ServicePageProps {
  params: { id: string; lang: string };
}

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { id: serviceId, lang } = params;

  const service: Service | null = await serviceOperations.getServiceById(serviceId);

  if (!service) {
    notFound();
  }

  let portfolioServices: Service[] = [];
  if (service.seller_id) {
    const allSellerServices = await serviceOperations.getServicesBySellerId(service.seller_id);
    portfolioServices = allSellerServices.filter(s => s.id !== serviceId);
  }

  return (
    <div className='container mx-auto w-full py-[30px] max-w-[1218px]'>
      <div className='mb-6'>
        <Breadcrumb.Root>
          <Breadcrumb.Item asChild className='text-[#525866] mr-2'>
            <Link href={`/${lang}/home`}>
              <Breadcrumb.Icon as={RiHomeSmile2Line} className='h-5 w-5' />
            </Link>
          </Breadcrumb.Item>

          {/* <Breadcrumb.ArrowIcon as={RiArrowRightSLine} /> */}
          <span className='text-[14px] text-[#CACFD8] mr-2'>/</span>

          <Breadcrumb.Item asChild className='text-[#525866] mr-2'>
            <Link href={`/${lang}/services/search?tab=Service`}>
              <Translate id="service.detail.page.breadcrumb.services" />
            </Link>
          </Breadcrumb.Item>

          {/* <span className='text-[14px] text-[#CACFD8] mr-2'>/</span>

          <Breadcrumb.Item active className='text-[#525866]'>{service.title}</Breadcrumb.Item> */}
        </Breadcrumb.Root>
      </div>

      <h1 className='text-[32px] mb-4 text-[#0E121B] font-medium leading-[40px] tracking-[-0.5%]'>
        <Translate id="service.detail.page.title" values={{ title: service.title }} />
      </h1>

      <div className='flex gap-[42px] md:grid-cols-12'>
        <div className='w-full max-w-[824px]'>
          <ServiceInfoLeft
            service={service}
            portfolioServices={portfolioServices}

          />
        </div>

        <div className='w-full max-w-[352px] max-h-[900px]'>
          <ServiceInfoRight service={service} />
        </div>
      </div>
    </div>
  );
}
