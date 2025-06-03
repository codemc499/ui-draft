'use client';

import React, { useState } from 'react';
import * as Tag from '@/components/ui/tag';
import * as Switch from '@/components/ui/switch';
import { RiInformationLine, RiCloseLine, RiSparklingFill, RiInformationFill } from '@remixicon/react';
import { cn } from '@/utils/cn';
import { WorkerSearchBar } from './WorkerSearchBar';
import { PriceRangeSlider } from '../../filters/PriceRangeSlider';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Icons } from '@/assets/images/icons/icons';

// Helper component for the input-like container
interface TagInputContainerProps {
  children: React.ReactNode;
}
const TagInputContainer: React.FC<TagInputContainerProps> = ({ children }) => {
  const { t } = useTranslation('common');
  return (
    <div className='mb-2 flex min-h-[36px] flex-wrap items-center gap-1.5 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-1.5'>
      {children}
      {/* Render children, and ensure min-height even if empty */}
      {React.Children.count(children) === 0 && (
        <span className='text-[12px] text-gray-400 '>{t('filters.select')}</span>
      )}
    </div>
  );
};

// Main Sidebar Component
interface ServiceFilterSidebarProps {
  activeTab: 'Service' | 'Worker' | 'Project';
  // Service specific callbacks
  onServicePriceRangeChange?: (range: [number, number]) => void;
  onServiceSkillsChange?: (skills: string[]) => void;
  // Worker specific callbacks
  onWorkerSearch?: (term: string) => void;
  onWorkerToggleChange?: (option: string, value: boolean) => void;
  workerSearchTerm?: string;
  // Project specific callbacks
  onProjectBudgetRangeChange?: (range: [number, number]) => void;
  onProjectSkillsChange?: (skills: string[]) => void;
  // Shared callbacks/props
  onClearAllFilters?: () => void;
  resetKey?: number;
}

const ServiceFilterSidebar: React.FC<ServiceFilterSidebarProps> = ({
  activeTab,
  onServicePriceRangeChange,
  onServiceSkillsChange,
  onWorkerSearch,
  onWorkerToggleChange,
  workerSearchTerm,
  onProjectBudgetRangeChange,
  onProjectSkillsChange,
  onClearAllFilters,
  resetKey,
}) => {
  const { t } = useTranslation('common');
  const [selectedSkills, setSelectedSkills] = useState(['Retrowave']);
  const [selectedTools, setSelectedTools] = useState(['Retrowave']);
  const [selectedFeaturedTags, setSelectedFeaturedTags] = useState([
    'Retrowave',
  ]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Default full range

  // --- Updated Filter Handlers --- //

  // Combined handler for Skills/Tags
  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
    // Call appropriate parent handler based on tab
    if (activeTab === 'Service' && onServiceSkillsChange) onServiceSkillsChange(newSkills);
    if (activeTab === 'Project' && onProjectSkillsChange) onProjectSkillsChange(newSkills);
    // Workers don't use this skills filter currently
  };
  const removeSkill = (skill: string) => {
    const newSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(newSkills);
    if (activeTab === 'Service' && onServiceSkillsChange) onServiceSkillsChange(newSkills);
    if (activeTab === 'Project' && onProjectSkillsChange) onProjectSkillsChange(newSkills);
  };
  const clearSkills = () => {
    setSelectedSkills([]);
    if (activeTab === 'Service' && onServiceSkillsChange) onServiceSkillsChange([]);
    if (activeTab === 'Project' && onProjectSkillsChange) onProjectSkillsChange([]);
  };

  // Combined handler for Price/Budget Range
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    if (activeTab === 'Service' && onServicePriceRangeChange) onServicePriceRangeChange(value);
    if (activeTab === 'Project' && onProjectBudgetRangeChange) onProjectBudgetRangeChange(value);
  };

  // Combined handler for Toggles (Available/Professional)
  const handleToggleChange = (option: string, checked: boolean) => {
    if (option === 'available') setIsAvailable(checked);
    if (option === 'professional') setIsProfessional(checked);
    // Only workers use these toggles currently
    if (activeTab === 'Worker' && onWorkerToggleChange) onWorkerToggleChange(option, checked);
  };

  // Tool handlers (only used for Service/Worker, not needed for Project)
  const handleToolToggle = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
    // TODO: Add onToolsChange callback if needed for Service/Worker
  };
  const removeTool = (tool: string) => {
    setSelectedTools((prev) => prev.filter((t) => t !== tool));
    // TODO: Add onToolsChange callback if needed for Service/Worker
  };
  const clearTools = () => setSelectedTools([]);

  // Featured Tag handlers (only used for Service/Worker, not needed for Project)
  const handleFeaturedTagToggle = (tag: string) => {
    setSelectedFeaturedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    // TODO: Add onFeaturedTagsChange callback if needed for Service/Worker
  };
  const removeFeaturedTag = (tag: string) => {
    setSelectedFeaturedTags((prev) => prev.filter((t) => t !== tag));
    // TODO: Add onFeaturedTagsChange callback if needed for Service/Worker
  };

  // Clear all filters handler
  const handleClearAllFilters = () => {
    // Reset local state
    setSelectedSkills([]);
    setSelectedTools([]);
    setSelectedFeaturedTags([]);
    setIsAvailable(false);
    setIsProfessional(false);
    setPriceRange([0, 1000]); // Reset to full range

    // Notify parent component
    if (onClearAllFilters) onClearAllFilters();
  };

  // Mock data (keep or replace with fetched options)
  const availableSkills = ['Digital Painting', 'Retrowave', 'NFT'];
  const availableTools = ['Digital Painting', 'Retrowave', 'NFT'];
  const availableFeaturedTags = ['Digital Painting', 'Retrowave', 'NFT'];

  return (
    <aside className='flex flex-col w-full h-full text-sm'>

      <div className='flex flex-col flex-1 h-[90%] overflow-y-auto custom-scrollbar'>
        {/* Worker Search Bar */}
        {activeTab === 'Worker' && (
          <WorkerSearchBar
            onSearch={onWorkerSearch}
            searchTerm={workerSearchTerm}
            resetKey={resetKey}
          />
        )}

        {/* Skills Section (Service & Project) */}
        <div className='mx-[16px]' >
          <div className='mb-2 flex items-center justify-between'>
            <h3 className='text-[14px] font-medium text-text-strong-950'>{t('filters.skills')}</h3>
            {selectedSkills.length > 0 && (
              <button onClick={clearSkills} className='text-[12px] font-medium text-[#525866] underline hover:text-text-primary-600'>
                {t('filters.clear')}
              </button>
            )}
          </div>
          <TagInputContainer>
            {selectedSkills.map((skill) => (
              <Tag.Root
                key={skill}
                className="!border font-medium !border-[#525866] text-[#525866]"
              >
                {skill}
                <Tag.Icon
                  as={RiCloseLine}
                  onClick={() => removeSkill(skill)}
                  className="ml-1 cursor-pointer text-[#525866] "
                />
              </Tag.Root>
            ))}
          </TagInputContainer>

          <div className="flex flex-wrap gap-1.5">
            {availableSkills
              .filter((skill) => !selectedSkills.includes(skill))
              .map((skill, idx) => (
                <Tag.Root
                  key={skill}
                  asChild
                  variant="gray"
                  className={`
                    cursor-pointer
                    ${idx % 2 === 0
                      ? "bg-white border border-gray-100 hover:bg-[#F6F8FA] hover:border-[#F6F8FA]"
                      : "bg-[#F6F8FA] border border-[#F6F8FA] hover:bg-white hover:border-gray-100"
                    }
                  `}
                >
                  <button onClick={() => handleSkillToggle(skill)}>
                    {skill}
                  </button>
                </Tag.Root>
              ))}
          </div>
          <hr className='border-stroke-soft-200 my-[16px]' />
        </div>


        {/* Featured Tags Section (Worker Only) */}
        {activeTab === 'Worker' && (
          <div className='mx-[16px]' >
            <div className='mb-2 flex items-center gap-1'>
              <h3 className='text-[14px] font-medium text-text-strong-950'>{t('filters.featuredTags')}</h3>
              <Icons.InformationButton />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableFeaturedTags.map((tag) => {
                const isSelected = selectedFeaturedTags.includes(tag)
                return (
                  <Tag.Root
                    key={tag}
                    asChild
                    variant="stroke"
                    className={`
                    bg-white
                    cursor-pointer
                    flex items-center
                    hover:bg-[#F6F8FA] hover:text-black
                    ${isSelected ?
                        'text-[#525866] !border font-medium !border-[#525866]' :
                        'text-[#525866]'
                      }
                  `}
                  >
                    <button onClick={() => handleFeaturedTagToggle(tag)} className="flex items-center">
                      <Tag.Icon>
                        <Image src="/images/Monday.com.svg" alt={t('filters.tagIcon')} width={16} height={16} />
                      </Tag.Icon>
                      <span>{tag}</span>
                      {isSelected && (
                        <Tag.Icon as={RiCloseLine} className="ml-1 cursor-pointer text-[#525866]" />
                      )}
                    </button>
                  </Tag.Root>
                )
              })}
            </div>

            <hr className='my-6 border-stroke-soft-200 my-[16px]' />
          </div>
        )}

        {/* Tools Section (Service & Worker Only) */}
        <div className='mx-[16px]' >
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <h3 className='text-[14px] font-medium text-text-strong-950'>{t('filters.tools')}</h3>
              <Icons.InformationButton />
            </div>
            {selectedTools.length > 0 && (
              <button onClick={clearTools} className='text-[12px] text-[#525866] underline hover:text-text-primary-600'>
                {t('filters.clear')}
              </button>
            )}
          </div>
          <TagInputContainer>
            {selectedTools.map((tool) => (
              <Tag.Root key={tool} className="!border font-medium !border-[#525866] text-[#525866] ">
                {tool}
                <Tag.Icon as={RiCloseLine} onClick={() => removeTool(tool)} className='ml-1 cursor-pointer text-[#525866]' />
              </Tag.Root>
            ))}
          </TagInputContainer>
          <div className='flex flex-wrap gap-1.5'>
            {availableTools
              .filter((tool) => !selectedTools.includes(tool))
              .map((tool, idx) => (
                <Tag.Root
                  key={tool}
                  asChild
                  variant="gray"
                  className={`
                    cursor-pointer
                    ${idx % 2 === 0
                      ? "bg-white border border-gray-100 hover:bg-[#F6F8FA] hover:border-[#F6F8FA]"
                      : "bg-[#F6F8FA] border border-[#F6F8FA] hover:bg-white hover:border-gray-100"
                    }
                  `}
                >
                  <button onClick={() => handleToolToggle(tool)}>{tool}</button>
                </Tag.Root>
              ))}
          </div>
          <hr className='my-6 border-stroke-soft-200 my-[16px]' />
        </div>

        {/* Featured Tags Section (Service Only) */}
        {activeTab === 'Service' && (
          <div className='mx-[16px]' >
            <div className='mb-2 flex items-center gap-1'>
              <h3 className='text-[14px] font-medium text-text-strong-950'>{t('filters.featuredTags')}</h3>
              <Icons.InformationButton />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableFeaturedTags.map((tag) => {
                const isSelected = selectedFeaturedTags.includes(tag)
                return (
                  <Tag.Root
                    key={tag}
                    asChild
                    variant="stroke"
                    className={`
                    bg-white
                    cursor-pointer
                    flex items-center
                    hover:bg-[#F6F8FA] hover:text-black
                    ${isSelected ?
                        'text-[#525866] !border font-medium !border-[#525866]' :
                        'text-[#525866]'
                      }
                  `}
                  >
                    <button onClick={() => handleFeaturedTagToggle(tag)} className="flex items-center">
                      <Tag.Icon>
                        <Image src="/images/Monday.com.svg" alt={t('filters.tagIcon')} width={16} height={16} />
                      </Tag.Icon>
                      <span>{tag}</span>
                      {isSelected && (
                        <Tag.Icon as={RiCloseLine} className="ml-1 cursor-pointer text-[#525866]" />
                      )}
                    </button>
                  </Tag.Root>
                )
              })}
            </div>

            <hr className='my-6 border-stroke-soft-200 my-[16px]' />
          </div>
        )}

        {/* Available and professional services toggles */}
        {(activeTab === 'Worker' || activeTab === 'Service') && (
          <div className="space-y-3 pl-4">
            {/* Item 1 - Available */}
            <div className="flex items-start gap-2">
              {/* Icon */}
              <Switch.Root
                className='mt-1'
                id='available-toggle'
                checked={isAvailable}
                onCheckedChange={(checked) => handleToggleChange('available', checked)}
              />
              {/* Text */}
              <div className='mt-0.5'>
                <p className="text-base font-normal text-[14px] text-[#1F2937]">{t('filters.available')}</p>
                <p className="text-[12px] font-normal text-[#6B7280]">{t('filters.recentOnline')}</p>
              </div>
            </div>

            {/* Item 2 - Professional */}
            <div className="flex items-start gap-2">
              {/* Icon */}
              <Switch.Root
                className='mt-1'
                id='professional-toggle'
                checked={isProfessional}
                onCheckedChange={(checked) => handleToggleChange('professional', checked)}
              />
              {/* Text */}
              <div className='mt-0.5'>
                <p className="text-base font-normal text-[14px] text-[#1F2937]">{t('filters.professionalServices')}</p>
                <p className="text-[12px] font-normal text-[#6B7280]">{t('filters.vettedSkills')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Options Section (Worker Only) */}
        {activeTab === 'Worker' && (
          <div className='space-y-4 mx-[16px]'>
            {/* <div className='flex items-start gap-3'>
            <Switch.Root className='mt-1' id='available-toggle' checked={isAvailable} onCheckedChange={(checked) => handleToggleChange('available', checked)} />
            <div>
              <label htmlFor='available-toggle' className='text-[14px] cursor-pointer font-medium text-text-strong-950'>Available</label>
              <p className='text-[12px] text-text-secondary-600'>Recent Online</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Switch.Root id='professional-toggle' checked={isProfessional} onCheckedChange={(checked) => handleToggleChange('professional', checked)} />
            <div>
              <label htmlFor='professional-toggle' className='text-[14px] cursor-pointer font-medium text-text-strong-950'>Professional Services</label>
              <p className='text-[12px] text-text-secondary-600'>Vetted skills and expertise</p>
            </div>
          </div>
          <hr className='my-6 border-stroke-soft-200 my-[16px]' /> */}
          </div>
        )}

        {/* Price/Budget Section (Service & Project) */}
        {(activeTab === 'Project') && (
          <div className='mx-[16px]' >
            <h3 className='mb-10 text-[14px] font-medium text-text-strong-950'>
              {t('filters.price')}
            </h3>
            <PriceRangeSlider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000} // Example max value, adjust as needed
              step={10}
              minStepsBetweenThumbs={1}
            />
          </div>
        )}
      </div>


      {/* Clear Filters Button */}
      <div className="mt-5 px-4 h-[10%]">
        <button
          onClick={handleClearAllFilters}
          className={cn(
            'w-full flex items-center text-[#525866] font-medium justify-center gap-1 rounded-[10px] border border-stroke-soft-200',
            'bg-bg-white-0 px-4 py-2.5 text-[14px] font-medium leading-[20px] shadow-[0px_1px_2px_0px_#5258660F] transition',
            'hover:bg-[#F5F7FA] hover:text-[#0E121B] hover:border-none focus:outline-none focus:ring-2 focus:ring-text-primary-600'
          )}
        >
          {t('filters.clearAll')}
        </button>
      </div>
    </aside>
  );
};

export default ServiceFilterSidebar;
