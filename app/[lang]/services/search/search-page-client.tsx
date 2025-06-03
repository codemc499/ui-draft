'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import ServiceCard from '@/components/cards/ServiceCard';
import WorkerCard from '@/components/cards/WorkerCard';
import ProjectCard from '@/components/cards/ProjectCard';
import ServiceFilterSidebar from '@/components/services/list/ServiceFilterSidebar';
import { ServiceSearchBar } from '@/components/services/list/ServiceSearchBar';
import { ProjectSearchBar } from '@/components/services/list/ProjectSearchBar';
import WorkerProfileDrawer from '@/components/worker/WorkerProfileDrawer';
import { serviceOperations, userOperations, jobOperations, contractOperations } from '@/utils/supabase/database';
import { Service, User, Job, Contract, JobApplication } from '@/utils/supabase/types';
import { useAuth } from '@/utils/supabase/AuthContext';
import { jobApplicationOperations } from '@/utils/supabase/job-application-operations';

// Define the possible tab values
type ActiveTabValue = 'Service' | 'Worker' | 'Project';

// Helper function to validate tab value
function isValidTabValue(value: string | null): value is ActiveTabValue {
  return value === 'Service' || value === 'Worker' || value === 'Project';
}

// Renamed component
export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, lang] = pathname.split('/');
  const { t } = useTranslation('common');

  const initialTab = searchParams.get('tab');
  const validatedInitialTab = isValidTabValue(initialTab) ? initialTab : 'Service';

  const [activeTab, setActiveTab] =
    useState<ActiveTabValue>(validatedInitialTab);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState<User | null>(
    null,
  );
  const [selectedWorkerServices, setSelectedWorkerServices] = useState<
    Service[] | null
  >(null);
  const [isDrawerLoading, setIsDrawerLoading] = useState<boolean>(false);

  // Define default filters state for services
  const defaultServiceFilters = {
    searchTerm: '',
    priceRange: null as [number, number] | null,
    tags: [] as string[],
    leadTime: null as number | null,
    sortBy: 'created_at' as string,
    sortOrder: 'desc' as 'asc' | 'desc',
    available: false,
    professional: false,
  };

  // Define default filters state for workers
  const defaultWorkerFilters = {
    searchTerm: '',
    skills: [] as string[],
    isAvailable: false,
    isProfessional: false,
    sortBy: 'created_at' as string,
    sortOrder: 'desc' as 'asc' | 'desc',
  };

  // Define default filters state for projects
  const defaultProjectFilters = {
    searchTerm: '',
    skills: [] as string[],
    budgetRange: null as [number, number] | null,
    deadline: null as string | null,
    purpose: null as string | null,
    postingDate: null as string | null,
    sortBy: 'created_at' as string,
    sortOrder: 'desc' as 'asc' | 'desc',
  };

  // Service data state
  const [services, setServices] = useState<Service[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [serviceIsLoading, setServiceIsLoading] = useState(true);
  const [servicePage, setServicePage] = useState(1);
  const [serviceFilters, setServiceFilters] = useState(defaultServiceFilters);

  // Worker data state
  const [workers, setWorkers] = useState<User[]>([]);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [workerIsLoading, setWorkerIsLoading] = useState(true);
  const [workerPage, setWorkerPage] = useState(1);
  const [workerFilters, setWorkerFilters] = useState(defaultWorkerFilters);

  // Project data state
  const [projects, setProjects] = useState<Job[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectIsLoading, setProjectIsLoading] = useState(true);
  const [projectPage, setProjectPage] = useState(1);
  const [projectFilters, setProjectFilters] = useState(defaultProjectFilters);
  const [applicationSubmitted, setApplicationSubmitted] = useState(0);
  const [projectBuyers, setProjectBuyers] = useState<Record<string, User | null>>({});

  const [resetKey, setResetKey] = useState(0);
  const itemsPerPage = 9;

  const { user } = useAuth();
  const [userContracts, setUserContracts] = useState<Contract[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [userApplications, setUserApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (!user) {
      setUserApplications([]);
      return;
    }
    jobApplicationOperations.getUserJobApplications(user.id)
      .then(setUserApplications)
      .catch(error => {
        console.error('[WorkerMainContent] Error fetching user applications:', error);
        setUserApplications([]);
      });
  }, [user, applicationSubmitted]);

  useEffect(() => {
    console.log('[SearchPageClient] User from useAuth:', user);
  }, [user]);

  // Update activeTab when URL search param changes
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    const validatedCurrentTab = isValidTabValue(currentTab)
      ? currentTab
      : 'Service';
    if (validatedCurrentTab !== activeTab) {
      setActiveTab(validatedCurrentTab);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  // Worker profile handlers
  const openWorkerProfile = async (workerId: string) => {
    setIsDrawerOpen(true);
    setIsDrawerLoading(true);
    setSelectedWorkerDetails(null);
    setSelectedWorkerServices(null);

    console.log(`Fetching data for worker: ${workerId}`);

    try {
      const [workerResult, servicesResult] = await Promise.all([
        userOperations.getUserById(workerId),
        serviceOperations.getServicesBySellerId(workerId),
      ]);

      console.log('Worker fetch result:', workerResult);
      console.log('Services fetch result:', servicesResult);

      if (workerResult) {
        setSelectedWorkerDetails(workerResult);
      } else {
        console.error(`Failed to fetch details for worker ${workerId}`);
      }

      setSelectedWorkerServices(servicesResult || []);
    } catch (error) {
      console.error(
        `Error fetching worker data or services for ${workerId}:`,
        error,
      );
    } finally {
      setIsDrawerLoading(false);
    }
  };

  const closeWorkerProfile = () => {
    setIsDrawerOpen(false);
  };

  // Fetch services with current filters and pagination
  useEffect(() => {
    if (activeTab !== 'Service') return;

    async function loadServices() {
      setServiceIsLoading(true);
      try {
        const offset = (servicePage - 1) * itemsPerPage;
        const { searchTerm, priceRange, tags, sortBy, sortOrder } = serviceFilters;
        const result = await serviceOperations.getServicesWithPagination({
          limit: itemsPerPage,
          offset,
          searchTerm,
          priceRange,
          tags,
          sortBy,
          sortOrder,
        });
        setServices(result.services);
        setTotalServices(result.total);
      } catch (error) {
        console.error('Error loading services:', error);
        setServices([]);
        setTotalServices(0);
      } finally {
        setServiceIsLoading(false);
      }
    }

    loadServices();
  }, [activeTab, servicePage, serviceFilters]);

  // Fetch workers with current filters and pagination
  useEffect(() => {
    if (activeTab !== 'Worker') return;

    async function loadWorkers() {
      setWorkerIsLoading(true);
      try {
        const offset = (workerPage - 1) * itemsPerPage;
        const { searchTerm, skills, isAvailable, isProfessional, sortBy, sortOrder } =
          workerFilters;
        const result = await userOperations.getWorkersWithPagination({
          limit: itemsPerPage,
          offset,
          searchTerm,
          skills,
          isAvailable,
          isProfessional,
          sortBy,
          sortOrder,
        });
        setWorkers(result.workers);
        setTotalWorkers(result.total);
      } catch (error) {
        console.error('Error loading workers:', error);
        setWorkers([]);
        setTotalWorkers(0);
      } finally {
        setWorkerIsLoading(false);
      }
    }

    loadWorkers();
  }, [activeTab, workerPage, workerFilters]);

  // Fetch projects with current filters and pagination
  useEffect(() => {
    if (activeTab !== 'Project') return;

    async function loadProjects() {
      setProjectIsLoading(true);
      try {
        const offset = (projectPage - 1) * itemsPerPage;
        const { searchTerm, skills, budgetRange, sortBy, sortOrder } =
          projectFilters;
        const result = await jobOperations.getJobsWithPagination({
          limit: itemsPerPage,
          offset,
          searchTerm,
          skills,
          budgetRange,
          sortBy,
          sortOrder,
        });
        setProjects(result.jobs);
        setTotalProjects(result.total);

        // Fetch buyer information for each project
        const buyerPromises = result.jobs.map(async (job) => {
          if (job.buyer_id) {
            const buyer = await userOperations.getUserById(job.buyer_id);
            return { [job.id]: buyer };
          }
          return { [job.id]: null };
        });

        const buyerResults = await Promise.all(buyerPromises);
        const buyersMap = buyerResults.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {} as Record<string, User | null>);
        setProjectBuyers(buyersMap);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
        setTotalProjects(0);
      } finally {
        setProjectIsLoading(false);
      }
    }

    loadProjects();
  }, [activeTab, projectPage, projectFilters]);

  // Fetch user contracts when user or activeTab changes, or when an application is submitted
  useEffect(() => {
    if (activeTab !== 'Project' || !user) {
      if (activeTab === 'Project' && !user) {
        console.log('[SearchPageClient] User not available for fetching contracts.');
      }
      setUserContracts([]); // Clear contracts if no user or not on project tab
      return;
    }
    console.log('[SearchPageClient] Fetching user contracts for user ID:', user.id, 'Trigger:', applicationSubmitted);
    setContractsLoading(true);
    contractOperations.getUserContracts(user.id)
      .then((contracts) => {
        console.log('[SearchPageClient] Fetched user contracts:', contracts);
        setUserContracts(contracts);
      })
      .catch(error => {
        console.error('[SearchPageClient] Error fetching user contracts:', error);
        setUserContracts([]); // Clear contracts on error
      })
      .finally(() => setContractsLoading(false));
  }, [user, activeTab, applicationSubmitted]);

  // Handle service search term changes
  const handleServiceSearch = (term: string) => {
    setServiceFilters((prev) => ({ ...prev, searchTerm: term }));
    setServicePage(1);
  };

  // Handle worker search term changes
  const handleWorkerSearch = (term: string) => {
    setWorkerFilters((prev) => ({ ...prev, searchTerm: term }));
    setWorkerPage(1);
  };

  // Handle project search term changes
  const handleProjectSearch = (term: string) => {
    setProjectFilters((prev) => ({ ...prev, searchTerm: term }));
    setProjectPage(1);
  };

  // Handle general filter changes from ProjectSearchBar (Deadline, Purpose, etc.)
  const handleProjectFilterChange = (
    filterType: string,
    value: string | null,
  ) => {
    setProjectFilters((prev) => ({ ...prev, [filterType]: value }));
    setProjectPage(1);
  };

  // Handle service filter changes from search bar
  const handleServiceFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'leadTime':
        setServiceFilters((prev) => ({
          ...prev,
          leadTime: parseInt(value),
        }));
        break;
      case 'priceRange':
        let priceRange: [number, number] | null = null;
        if (value === 'low') priceRange = [0, 50];
        else if (value === 'medium') priceRange = [51, 200];
        else if (value === 'high') priceRange = [201, 10000];
        setServiceFilters((prev) => ({ ...prev, priceRange }));
        break;
      case 'sort':
        let sortConfig = {
          sortBy: 'created_at',
          sortOrder: 'desc' as 'asc' | 'desc',
        };
        if (value === 'newest') {
          sortConfig = { sortBy: 'created_at', sortOrder: 'desc' };
        } else if (value === 'oldest') {
          sortConfig = { sortBy: 'created_at', sortOrder: 'asc' };
        } else if (value === 'price_asc') {
          sortConfig = { sortBy: 'price', sortOrder: 'asc' };
        } else if (value === 'price_desc') {
          sortConfig = { sortBy: 'price', sortOrder: 'desc' };
        }
        setServiceFilters((prev) => ({ ...prev, ...sortConfig }));
        break;
    }
    setServicePage(1);
  };

  // Handle service price range filter from sidebar
  const handleServicePriceRangeChange = (range: [number, number]) => {
    setServiceFilters((prev) => ({ ...prev, priceRange: range }));
    setServicePage(1);
  };

  // Handle service tag filters from sidebar
  const handleServiceSkillsChange = (skills: string[]) => {
    setServiceFilters((prev) => ({ ...prev, tags: skills }));
    setServicePage(1);
  };

  // Handle project skills change from sidebar
  const handleProjectSkillsChange = (skills: string[]) => {
    setProjectFilters((prev) => ({ ...prev, skills }));
    setProjectPage(1);
  };

  // Handle project budget change from sidebar
  const handleProjectBudgetRangeChange = (range: [number, number]) => {
    setProjectFilters((prev) => ({ ...prev, budgetRange: range }));
    setProjectPage(1);
  };

  // Handle toggle changes from sidebar
  const handleToggleChange = (option: string, value: boolean) => {
    if (activeTab === 'Service') {
      if (option === 'available') {
        setServiceFilters((prev) => ({ ...prev, available: value }));
      } else if (option === 'professional') {
        setServiceFilters((prev) => ({ ...prev, professional: value }));
      }
      setServicePage(1);
    } else if (activeTab === 'Worker') {
      if (option === 'available') {
        setWorkerFilters((prev) => ({ ...prev, isAvailable: value }));
      } else if (option === 'professional') {
        setWorkerFilters((prev) => ({ ...prev, isProfessional: value }));
      }
      setWorkerPage(1);
    } else if (activeTab === 'Project') {
      setProjectFilters((prev) => ({ ...prev, [option]: value }));
      setProjectPage(1);
    }
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    if (activeTab === 'Service') {
      setServiceFilters(defaultServiceFilters);
      setServicePage(1);
    } else if (activeTab === 'Worker') {
      setWorkerFilters(defaultWorkerFilters);
      setWorkerPage(1);
    } else if (activeTab === 'Project') {
      setProjectFilters(defaultProjectFilters);
      setProjectPage(1);
    }
    setResetKey((prev) => prev + 1);
  };

  // Calculate total pages
  const totalServicePages = Math.max(
    1,
    Math.ceil(totalServices / itemsPerPage),
  );
  const totalWorkerPages = Math.max(1, Math.ceil(totalWorkers / itemsPerPage));
  const totalProjectPages = Math.max(
    1,
    Math.ceil(totalProjects / itemsPerPage),
  );

  // Pagination handlers
  const handleServicePrevPage = () => {
    if (servicePage > 1) setServicePage((prev) => prev - 1);
  };
  const handleServiceNextPage = () => {
    if (servicePage < totalServicePages) setServicePage((prev) => prev + 1);
  };
  const handleWorkerPrevPage = () => {
    if (workerPage > 1) setWorkerPage((prev) => prev - 1);
  };
  const handleWorkerNextPage = () => {
    if (workerPage < totalWorkerPages) setWorkerPage((prev) => prev + 1);
  };
  const handleProjectPrevPage = () => {
    if (projectPage > 1) setProjectPage((prev) => prev - 1);
  };
  const handleProjectNextPage = () => {
    if (projectPage < totalProjectPages) setProjectPage((prev) => prev + 1);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    const newTab = value as ActiveTabValue;
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set('tab', newTab);
    router.push(`/${lang}/services/search?${currentParams.toString()}`);
  };

  // const handleApplyToProject = async (projectId: string, projectTitle: string) => {
  //   if (!user) {
  //     console.error('[SearchPageClient] User not logged in. Cannot apply.');
  //     // Optionally, trigger a notification to log in
  //     return;
  //   }

  //   console.log(`[SearchPageClient] Attempting to apply to project ID: ${projectId} by user ID: ${user.id}`);

  //   // Check if already applied (client-side check before DB call)
  //   const alreadyApplied = userContracts.some(
  //     (contract) => contract.job_id === projectId && contract.seller_id === user.id
  //   );

  //   if (alreadyApplied) {
  //     console.log(`[SearchPageClient] User ${user.id} already applied to project ${projectId}.`);
  //     // Notify user they've already applied (though button should be disabled)
  //     // This is a safeguard.
  //     return;
  //   }

  //   try {
  //     const newContractData: Omit<Contract, 'id' | 'created_at'> = {
  //       buyer_id: 'placeholder-buyer-id', // This needs to be the actual buyer_id of the job/project
  //       seller_id: user.id,
  //       job_id: projectId,
  //       service_id: null,
  //       title: `Application for: ${projectTitle}`,
  //       contract_type: 'one-time', // Or determine based on project
  //       status: 'pending', // Initial status for an application
  //       amount: 0, // Or project.budget, or to be negotiated
  //       description: `User ${user.id} applied to project ${projectTitle}`,
  //       attachments: [],
  //       currency: 'USD', // Or from project
  //     };

  //     // We need the project's buyer_id. Let's find the project first.
  //     const projectToApply = projects.find(p => p.id === projectId);
  //     if (!projectToApply || !projectToApply.buyer_id) {
  //       console.error('[SearchPageClient] Could not find project or project.buyer_id to apply.');
  //       // Notify error
  //       return;
  //     }
  //     newContractData.buyer_id = projectToApply.buyer_id;
  //     if (projectToApply.budget) {
  //       newContractData.amount = projectToApply.budget;
  //     }
  //     if (projectToApply.currency) {
  //       newContractData.currency = projectToApply.currency;
  //     }


  //     console.log('[SearchPageClient] Creating contract with data:', newContractData);
  //     const createdContract = await contractOperations.createContract(newContractData);

  //     if (createdContract) {
  //       console.log('[SearchPageClient] Successfully applied (contract created):', createdContract);
  //       // Trigger a re-fetch of contracts to update the UI
  //       setApplicationSubmitted(prev => prev + 1);
  //       // Optionally, show success notification (ProjectCard also shows one)
  //     } else {
  //       console.error('[SearchPageClient] Failed to create contract for application.');
  //       // Notify user of failure
  //     }
  //   } catch (error) {
  //     console.error('[SearchPageClient] Error during application process:', error);
  //     // Notify user of error
  //   }
  // };

  const handleApplyToProject = async (projectId: string, projectTitle: string) => {
    if (!user) {
      console.error('[WorkerMainContent] User not logged in. Cannot apply.');
      return;
    }
    if (!projectId) {
      console.error('[WorkerMainContent] Job ID missing. Cannot apply.');
      return;
    }

    const alreadyApplied = userApplications.some(
      (application) => application.job_id === projectId && application.seller_id === user.id
    );
    if (alreadyApplied) {
      console.log(`[WorkerMainContent] User ${user.id} already applied to project ${projectId}.`);
      return;
    }

    try {
      const createdApplication = await jobApplicationOperations.createJobApplication(projectId, user.id);

      if (createdApplication) {
        setApplicationSubmitted(prev => prev + 1);
      } else {
        console.error('[WorkerMainContent] Failed to create job application.');
      }
    } catch (error) {
      console.error('[WorkerMainContent] Error during application process:', error);
    }
  };

  return (
    <>
      <div className='flex flex-1 gap-6 pt-8 pb-2 max-h-[85vh] mx-auto w-full max-w-[1376px]'>
        {/* Left Column: Tabs + Filters */}
        <div className='w-full max-w-[342px] flex-shrink-0 flex flex-col h-[85vh] space-y-4'>
          {/* Tab Navigation */}
          <div className='border-b border-stroke-soft-200 flex-shrink-0'>
            <TabMenuHorizontal.Root
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <TabMenuHorizontal.List className="flex justify-center items-center px-4 border-y-0 gap-2">
                <TabMenuHorizontal.Trigger value='Service' className="text-[16px] px-4 font-medium leading-8 tracking-normal text-center hover:text-black">
                  {t('services.search.page.tabs.service')}
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='Worker' className="text-[16px] px-4 font-medium leading-8 tracking-normal text-center hover:text-black">
                  {t('services.search.page.tabs.worker')}
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='Project' className="text-[16px] px-4 font-medium leading-8 tracking-normal text-center hover:text-black">
                  {t('services.search.page.tabs.project')}
                </TabMenuHorizontal.Trigger>
              </TabMenuHorizontal.List>
            </TabMenuHorizontal.Root>
          </div>

          {/* Filters Sidebar */}
          <div className="flex-grow overflow-y-auto flex">
            <ServiceFilterSidebar
              activeTab={activeTab}
              onServicePriceRangeChange={handleServicePriceRangeChange}
              onServiceSkillsChange={handleServiceSkillsChange}
              onWorkerSearch={handleWorkerSearch}
              onWorkerToggleChange={handleToggleChange}
              workerSearchTerm={workerFilters.searchTerm}
              onProjectBudgetRangeChange={handleProjectBudgetRangeChange}
              onProjectSkillsChange={handleProjectSkillsChange}
              onClearAllFilters={handleClearAllFilters}
              resetKey={resetKey}
            />
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className='w-full max-w-[1010px] flex-1 space-y-4 min-w-0 max-h-full'>
          {/* Search Bars */}
          {activeTab === 'Service' && (
            <ServiceSearchBar
              onSearch={handleServiceSearch}
              onFilterChange={handleServiceFilterChange}
              searchTerm={serviceFilters.searchTerm}
              resetKey={resetKey}
            />
          )}
          {activeTab === 'Project' && (
            <ProjectSearchBar
              onSearch={handleProjectSearch}
              onFilterChange={handleProjectFilterChange}
              searchTerm={projectFilters.searchTerm}
              resetKey={resetKey}
            />
          )}

          {/* Services Grid */}
          {activeTab === 'Service' && (
            <div className='h-[85%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {serviceIsLoading ? (
                <div className='grid grid-cols-3 gap-4'>
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-pulse shadow-sm overflow-hidden rounded-lg border border-stroke-soft-200 bg-bg-white-0'
                    >
                      <div className='h-40 w-full bg-gray-200'></div>
                      <div className='p-3 space-y-2'>
                        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                        <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                        <div className='flex justify-between'>
                          <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                          <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : services.length > 0 ? (
                <>
                  <div className='grid grid-cols-3 gap-x-4 gap-y-6'>
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/${lang}/services/${service.id}`}
                        passHref
                        legacyBehavior
                      >
                        <a className='block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg'>
                          <ServiceCard service={service} />
                        </a>
                      </Link>
                    ))}
                  </div>

                  {totalServicePages > 1 && (
                    <div className='flex justify-center gap-2 mt-6'>
                      <button
                        onClick={handleServicePrevPage}
                        disabled={servicePage === 1}
                        className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50'
                      >
                        {t('services.search.page.pagination.previous')}
                      </button>
                      <span className='px-4 py-1'>
                        {t('services.search.page.pagination.page', { current: servicePage, total: totalServicePages })}
                      </span>
                      <button
                        onClick={handleServiceNextPage}
                        disabled={servicePage === totalServicePages}
                        className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50'
                      >
                        {t('services.search.page.pagination.next')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <p className='text-lg font-medium mb-2'>{t('services.search.page.noResults.services.title')}</p>
                  <p className='text-gray-500'>
                    {t('services.search.page.noResults.services.description')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Workers Grid */}
          {activeTab === 'Worker' && (
            <div className='h-[100%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {workerIsLoading ? (
                <div className='grid grid-cols-2 gap-4'>
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-pulse shadow-sm overflow-hidden rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'
                    >
                      <div className='flex gap-3'>
                        <div className='h-12 w-12 rounded-full bg-gray-200'></div>
                        <div className='flex-1'>
                          <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                          <div className='h-3 bg-gray-200 rounded w-1/2 mb-4'></div>
                          <div className='flex flex-wrap gap-1 mb-2'>
                            <div className='h-6 rounded bg-gray-200 w-16'></div>
                            <div className='h-6 rounded bg-gray-200 w-20'></div>
                          </div>
                        </div>
                      </div>
                      <div className='h-4 bg-gray-200 rounded mt-3'></div>
                    </div>
                  ))}
                </div>
              ) : workers.length > 0 ? (
                <>
                  <div className='grid grid-cols-2 gap-6'>
                    {workers.map((worker) => (
                      <WorkerCard
                        key={worker.id}
                        worker={worker}
                        onClick={() => openWorkerProfile(worker.id)}
                      />
                    ))}
                  </div>

                  {totalWorkerPages > 1 && (
                    <div className='flex justify-center gap-2 mt-6'>
                      <button
                        onClick={handleWorkerPrevPage}
                        disabled={workerPage === 1}
                        className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50'
                      >
                        {t('services.search.page.pagination.previous')}
                      </button>
                      <span className='px-4 py-1'>
                        {t('services.search.page.pagination.page', { current: workerPage, total: totalWorkerPages })}
                      </span>
                      <button
                        onClick={handleWorkerNextPage}
                        disabled={workerPage === totalWorkerPages}
                        className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50'
                      >
                        {t('services.search.page.pagination.next')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <p className='text-lg font-medium mb-2'>{t('services.search.page.noResults.workers.title')}</p>
                  <p className='text-gray-500'>
                    {t('services.search.page.noResults.workers.description')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Project Tab */}
          {activeTab === 'Project' && (
            <div className='h-[85%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {projectIsLoading || contractsLoading ? (
                <div className='flex flex-col space-y-4 '>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='animate-pulse overflow-hidden rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4 shadow-sm'
                    >
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]'>
                        <div className='flex flex-col gap-3'>
                          <div className='h-6 bg-gray-200 rounded w-3/4'></div>
                          <div className='flex flex-wrap gap-1.5'>
                            <div className='h-5 bg-gray-200 rounded w-20'></div>
                            <div className='h-5 bg-gray-200 rounded w-24'></div>
                          </div>
                          <div className='h-4 bg-gray-200 rounded w-full'></div>
                          <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                          <div className='flex items-center gap-2 pt-2'>
                            <div className='h-6 w-6 rounded-full bg-gray-200'></div>
                            <div className='h-4 bg-gray-200 rounded w-24'></div>
                          </div>
                        </div>
                        <div className='flex flex-col items-end justify-between gap-4 md:justify-start'>
                          <div className='text-right'>
                            <div className='h-4 bg-gray-200 rounded w-12 mb-1'></div>
                            <div className='h-6 bg-gray-200 rounded w-20'></div>
                          </div>
                          <div className='h-8 bg-gray-200 rounded w-24 mt-auto'></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className=''>
                  <div className='flex flex-col space-y-0'>
                    {projects.map((project) => {
                      console.log(`[SearchPageClient] Checking project ID: ${project.id}, User ID: ${user?.id}`);
                      console.log('[SearchPageClient] Current userContracts:', userContracts);
                      // const foundContract = userContracts.find(
                      //   (contract) => {
                      //     const conditionsMet = contract.seller_id === user?.id && contract.job_id === project.id;
                      //     if (contract.job_id === project.id) {
                      //       console.log(`[SearchPageClient] Contract ${contract.id} (job_id: ${contract.job_id}) vs Project ${project.id}. Seller_id match: ${contract.seller_id === user?.id}`);
                      //     }
                      //     return conditionsMet;
                      //   }
                      // );
                      const hasApplied = user ? userApplications.some(
                        (application) => application.job_id === project.id && application.seller_id === user.id
                      ) : false;
                      console.log('[SearchPageClient] hasApplied for project ' + project.id + ':', hasApplied);
                      return (
                        <Link
                          key={project.id}
                          href={`/${lang}/projects/${project.id}`}
                          passHref
                          legacyBehavior
                        >
                          <a className='block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-[#E5E7EB] mt-0 py[16px]'>
                            <ProjectCard
                              title={project.title}
                              infoBadges={[
                                { label: project.status || 'Open' },
                                {
                                  label: project.usage_option || 'Private',
                                },
                                {
                                  label: project.privacy_option || 'Public',
                                },
                              ]}
                              skillTags={project.skill_levels || []}
                              description={
                                project.description ||
                                'No description available.'
                              }
                              client={{
                                avatarUrl:
                                  'https://placekitten.com/24/24?image=' +
                                  project.id.substring(0, 2),
                                name: project.buyer_id ? (projectBuyers[project.id]?.full_name || 'Client Name') : 'Client Name',
                                rating: 4.5,
                                reviewCount: 10,
                              }}
                              budget={project.budget || 0}
                              projectId={project.id}
                              hasApplied={hasApplied}
                              onApply={() => handleApplyToProject(project.id, project.title)}
                            />
                          </a>
                        </Link>
                      );
                    })}
                  </div>

                  {totalProjectPages > 1 && (
                    <div className='flex justify-center items-center gap-2 mt-6'>
                      <button
                        onClick={handleProjectPrevPage}
                        disabled={projectPage === 1}
                        className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50'
                      >
                        {t('services.search.page.pagination.previous')}
                      </button>
                      <span className='px-4 py-1'>
                        {t('services.search.page.pagination.page', { current: projectPage, total: totalProjectPages })}
                      </span>
                      <button
                        onClick={handleProjectNextPage}
                        disabled={projectPage === totalProjectPages}
                        className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50'
                      >
                        {t('services.search.page.pagination.next')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <p className='text-lg font-medium mb-2'>{t('services.search.page.noResults.projects.title')}</p>
                  <p className='text-gray-500'>
                    {t('services.search.page.noResults.projects.description')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Worker Profile Drawer */}
      <WorkerProfileDrawer
        isOpen={isDrawerOpen}
        onClose={closeWorkerProfile}
        worker={selectedWorkerDetails}
        services={selectedWorkerServices}
        isLoading={isDrawerLoading}
      />
    </>
  );
}
