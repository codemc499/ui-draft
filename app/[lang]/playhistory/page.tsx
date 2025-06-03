'use client';

import TabControl, { TabItem } from '@/src/components/ui/tab-control';

export default function PlayHistoryPage() {
  const handleSettingsClick = () => {
    // Handle settings click
    console.log('Settings clicked');
  };

  interface PlayHistoryItemProps {
    avatarUrl: string;
    name: string;
    time: string;
    timeAgo: string;
    deleteShow?: boolean;
  }

  function PlayHistoryItem({ avatarUrl, name, time, timeAgo, deleteShow = false }: PlayHistoryItemProps) {
    return (
      <div className="col-span-1 flex justify-between">
        <div className="flex gap-2">
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 mr-3 rounded-full" />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-3 rounded-full mr-8 h-6 px-1 py-0.5 leading-[20px] mt-2 ">{timeAgo}</div>
        {deleteShow && <div className="text-xs text-gray-500 bg-gray-100 px-3 rounded-full mr-8 h-6 px-1 py-0.5 leading-[20px] mt-2 cursor-pointer">x</div>}
      </div>
    );
  }

  const playHistoryItems = [
    {
      avatarUrl: '/images/man.jpg',
      name: 'John Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/woman.jpg',
      name: 'Sophie Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/man.jpg',
      name: 'John Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/woman.jpg',
      name: 'Sophie Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/man.jpg',
      name: 'John Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/woman.jpg',
      name: 'Sophie Bae',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/woman.jpg',
      name: 'Sophie Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/man.jpg',
      name: 'John Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/woman.jpg',
      name: 'Sophie Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/man.jpg',
      name: 'John Doe',
      time: '04:26',
      timeAgo: '1d ago',
    },
    {
      avatarUrl: '/images/woman.jpg',
      name: 'Sophie Bae',
      time: '04:26',
      timeAgo: '1d ago',
    },
  ]

  const PlayHistoryGrid = ({ items }: { items: PlayHistoryItemProps[] }) => {
    return (
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <PlayHistoryItem key={`${item.name}-${item.timeAgo}-${Math.random()}`} {...item} />
        ))}
      </div>
    );
  };

  const tabs: TabItem[] = [
    {
      id: 'play-history',
      label: 'Play History',
      href: '/playhistory',
      content: (
        <PlayHistoryGrid items={playHistoryItems} />
      ),
    },
    {
      id: 'partner',
      label: 'Partner',
      href: '/playhistory',
      content: (
        <div>
          <div className="grid grid-cols-3 gap-3">
            {playHistoryItems.map((item) => (
              <PlayHistoryItem
                avatarUrl={item.avatarUrl}
                name={item.name}
                time={item.time}
                timeAgo={item.timeAgo}
                deleteShow={true}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'follows',
      label: 'Follows',
      href: '/playhistory',
      content: (
        <div>
          <div className="grid grid-cols-3 gap-3">
            {playHistoryItems.map((item) => (
              <PlayHistoryItem
                avatarUrl={item.avatarUrl}
                name={item.name}
                time={item.time}
                timeAgo={item.timeAgo}
                deleteShow={true}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'saved-jobs',
      label: 'Saved Jobs',
      href: '/playhistory',
      content: (
        <div className='grid grid-cols-2 gap-4'>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="max-w-xl p-4 px-8 border-b border-gray-200 relative">
              <button className="absolute top-4 -right-6 text-gray-700 P-2 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-medium text-gray-900 text-[20px]">Write professional resume</h2>
                    <div className="px-3 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-500 font-medium">
                      BUSINESS
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 text-[12px] font-medium rounded-full border border-gray-900 text-gray-900">
                      Mixing
                    </span>
                    <span className="px-2 py-0.5 text-[12px] font-medium rounded-full bg-gray-100 text-gray-700">
                      Singing
                    </span>
                    <span className="px-2 py-0.5 text-[12px] font-medium rounded-full bg-gray-100 text-gray-700">
                      Jazz
                    </span>
                    <span className="px-2 py-0.5 text-[12px] font-medium rounded-full bg-gray-100 text-gray-700">
                      5+
                    </span>
                  </div>
                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-[12px]">
                      E
                    </div>
                    <span className='text-[12px]'>Cleve Music</span>
                    <div className="w-4 h-4 text-yellow-500 text-[2rem] fill-yellow-500"> * </div>
                    <span className="text-gray-700 text-[12px]">4.9 (125)</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium mb-2">Budget</div>
                  <div className="text-lg font-semibold text-gray-900">$1,400</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'saved-services',
      label: 'Saved Services',
      href: '/playhistory',
      content: (
        <div className='grid grid-cols-3 gap-4'>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="relative border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <button className="absolute top-4 right-4 text-gray-700 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#eee">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="flex flex-col gap-3">
                <img
                  src="/images/bg2.png"
                  alt="Service preview"
                  className="w-full h-48 object-cover rounded-lg rounded-bl-none rounded-br-none"
                />

                <div className="p-4">
                  <h3 className="text-lg font-medium">Draw catchy and eye-catching illustrations11111</h3>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-[12px]">
                      E
                    </div>
                    <span className="text-sm">Cleve Music</span>
                    <div className="flex items-center">
                      {[1, 2, 3].map((_, i) => (
                        <img
                          key={i}
                          src="https://www.google.com/favicon.ico"
                          alt="Google"
                          className="w-4 h-4"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm">4.9 (125)</span>
                    </div>
                    <div className="ml-auto">
                      <span className="text-lg font-semibold">$101</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}


        </div>
      ),
    },
  ];

  const Pagination: React.FC = () => (
    <nav className="flex items-center justify-center space-x-2 my-10 mb-50" aria-label="Pagination">
      <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100">&lt;</button>
      {[1, 2, 3].map((page) => (
        <a
          key={page}
          href="#"
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          {page}
        </a>
      ))}
      <span className="px-3 py-1 text-gray-500">...</span>
      <a href="#" className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
        10
      </a>
      <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100">&gt;</button>
    </nav>
  );

  return (
    <div className="">
      <TabControl
        tabs={tabs}
        defaultTab="play-history"
        showSettings={true}
        onSettingsClick={handleSettingsClick}
      />
      <Pagination />
    </div>
  );
}