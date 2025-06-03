import React from "react";
import Image from 'next/image';

export default function PartnerProgram() {
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
    <div className="bg-white text-black px-6 py-10 space-y-12 px-[120px]">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <p className="text-sm tracking-widest uppercase">Start Earning</p>
        <h1 className="text-[24px] font-bold">Become Our Partner!</h1>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl space-y-4 bg-gradient-to-r from-black/5 to-transparent">
          <div className="flex items-start">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-black/20 to-transparent border border-gray-300 text-[1rem] font-medium rounded-full">Code</span>
          </div>
          <h3 className="text-[2rem] font-semibold">Earn with Your Skills</h3>
          <p className="text-gray-600 text-[18px]">Turn your audio skills into earnings with flexible job opportunities.</p>
          <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Get Now
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-2xl space-y-4 bg-gradient-to-r from-black/5 to-transparent">
          <div className="flex items-start">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-black/20 to-transparent border border-gray-300 text-[1rem] font-medium rounded-full">Reward</span>
          </div>
          <h3 className="text-[2rem] font-semibold">Earn with Your Skills</h3>
          <p className="text-gray-600 text-[18px]">Turn your audio skills into earnings with flexible job opportunities.</p>
          <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Invite
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>

      {/* How it works Section */}
      <div className="bg-black text-white rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 ">
        <div>
          <h3 className="font-semibold text-[1.5rem]">How it works?</h3>
          <p className="text-sm text-gray-200 mt-4">How to become a <br />business person.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[1.5rem]">Engage people</h3>
          <p className="text-sm text-gray-200 mt-4">Share your referral link with people that are interested in buying games.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[1.5rem]">Watch your earnings grow</h3>
          <p className="text-sm text-gray-200 mt-4">Monitor your earnings on your affiliate portal. Receive commission for referred orders.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[1.5rem]">Receive your money</h3>
          <p className="text-sm text-gray-200 mt-4">As a reward for your commitment, you will receive real money!</p>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="https://www.innhee.com/user/1525689"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex gap-4 pt-8cursor-pointer">
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
        </div>

      </div>

      {/* Conditions Table */}
      <div className="overflow-x-auto bg-gray-100 p-4 rounded-2xl">
        <table className="min-w-full border rounded-xl">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 text-[20px]">Condition for Achieving Rebate</th>
              <th className="px-4 py-2">Rebate Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">1-5 successful referrals, OR total transaction amount of referred users reaches $2,000</td>
              <td className="px-4 py-2">30%</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">6-10 successful referrals, OR total transaction amount of referred users reaches $8,000</td>
              <td className="px-4 py-2">35%</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">10+ successful referrals, OR total transaction amount of referred users reaches $15,000</td>
              <td className="px-4 py-2">40%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                { id: '#12345', amount: '$240', time: '12.03.24 02:15', type: 'Mining', status: 'Completed' },
                { id: '#12355', amount: '$250', time: '12.03.24 02:15', type: 'Mining', status: 'In Progress' },
                { id: '#12365', amount: '$250', time: '12.03.24 02:15', type: 'Mining', status: 'Canceled' },
                { id: '#12385', amount: '$190', time: '12.03.24 02:15', type: 'Mining', status: 'Completed' },
                { id: '#12395', amount: '$240', time: '12.03.24 02:15', type: 'Mining', status: 'Completed' },
                { id: '#12405', amount: '$250', time: '12.03.24 02:15', type: 'Mining', status: 'Canceled' },
                { id: '#12415', amount: '$250', time: '12.03.24 02:15', type: 'Mining', status: 'Canceled' },
                { id: '#12425', amount: '$240', time: '12.03.24 02:15', type: 'Mining', status: 'Completed' }
              ].map((row, idx) => (
                <tr key={idx} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.type}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination />


    </div>
  );
}