'use client';

import React from 'react';
import { useAuth } from '@/utils/supabase/AuthContext';
import {
  contractMilestoneOperations,
  contractOperations,
  jobOperations,
  userOperations,
} from '@/utils/supabase/database';
import {
  RiHeartLine,
} from '@remixicon/react';
import { Icons } from '@/assets/images/icons/icons';
import * as LinkButton from '@/components/ui/link-button';
import SummarySection, {
  type SummaryData,
} from '@/components/settings/SummarySection';
import TabsFiltersBar from '@/components/settings/TabsFiltersBar';
import OrdersTable, {
  type BuyerEngagement,
  type SellerOrder,
} from '@/components/settings/OrdersTable';
import PaginationBar from '@/components/settings/PaginationBar';
import { useTranslation } from 'react-i18next';

/* ------------------------------------------------------------------ */
/** Main right‑hand pane for "Orders" view (both buyers & sellers).   */
export default function OrdersContent() {
  const { t } = useTranslation('common');
  const { user, userProfile, loading: authLoading, profileLoading } = useAuth();
  const userType = userProfile?.user_type;      // 'buyer' | 'seller'
  const isBuyer = userType === 'buyer';

  /* ------------------ state ------------------ */
  const [orders, setOrders] = React.useState<(BuyerEngagement | SellerOrder)[]>([]);
  const [dataLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Demo transaction data
  const demoTransactions = [
    {
      id: 'TRX-001',
      amount: 299.99,
      date: '2024-03-15',
      from: 'John Smith',
      paymentMethod: 'Visa ending in 4242',
      status: 'Completed',
      type: 'Payment'
    },
    {
      id: 'TRX-002',
      amount: 150.00,
      date: '2024-03-14',
      from: 'Alice Johnson',
      paymentMethod: 'Mastercard ending in 5555',
      status: 'Pending',
      type: 'Refund'
    },
    {
      id: 'TRX-003',
      amount: 499.99,
      date: '2024-03-13',
      from: 'Bob Wilson',
      paymentMethod: 'PayPal',
      status: 'Completed',
      type: 'Payment'
    },
    {
      id: 'TRX-004',
      amount: 75.00,
      date: '2024-03-12',
      from: 'Sarah Davis',
      paymentMethod: 'Apple Pay',
      status: 'Processing',
      type: 'Payment'
    },
    {
      id: 'TRX-005',
      amount: 199.99,
      date: '2024-03-11',
      from: 'Mike Brown',
      paymentMethod: 'Visa ending in 1234',
      status: 'Completed',
      type: 'Payment'
    }
  ];

  const [activeTab, setActiveTab] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [sortOption, setSortOption] = React.useState('default');

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const [orderStats, setOrderStats] = React.useState<{ totalAmount: number, settled: number, inEscrow: number, refunded: number }>({ totalAmount: 0, settled: 0, inEscrow: 0, refunded: 0 });

  const fetchOrderStats = async () => {
    if (!user || !userType) return;
    const stats = await contractMilestoneOperations.getUserOrderStats(user.id, userType);
    setOrderStats(stats);
  };

  React.useEffect(() => {
    fetchOrderStats();
  }, [user, userType]);

  /* ------------------ fetch orders ------------------ */
  React.useEffect(() => {
    if (authLoading || profileLoading || !user || !userType) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isBuyer) {
          /* --- buyer: jobs + linked contracts --- */
          const [jobs, contracts] = await Promise.all([
            jobOperations.getJobsByBuyerId(user.id),
            contractOperations.getUserContracts(user.id),
          ]);

          const contractMap = new Map<string, Awaited<ReturnType<typeof contractOperations.getUserContracts>>[number]>();
          contracts.forEach((c) => c.job_id && contractMap.set(c.job_id, c));

          const rows: BuyerEngagement[] = await Promise.all(
            jobs.map(async (job) => {
              const linked = contractMap.get(job.id);
              if (linked && linked.seller_id) {
                const seller = await userOperations.getUserById(linked.seller_id);
                return {
                  id: linked.id,
                  type: 'contract',
                  contractId: linked.id,
                  subject: job.title,
                  price: linked.amount,
                  deadline: job.deadline || 'N/A',
                  worker: seller
                    ? {
                      id: seller.id,
                      name: seller.full_name,
                      avatarUrl: seller.avatar_url || 'https://via.placeholder.com/40',
                    }
                    : null,
                  status: linked.status || 'pending',
                  currency: job.currency || 'USD',
                };
              }
              return {
                id: job.id,
                type: 'job',
                contractId: null,
                subject: job.title,
                price: job.budget,
                deadline: job.deadline || 'N/A',
                worker: null,
                status: job.status || 'open',
                currency: job.currency || 'USD',
              };
            }),
          );

          setOrders(rows);

        } else {
          /* --- seller: contracts where user is seller --- */
          const contracts = await contractOperations.getUserContracts(user.id);
          const sellerRows: SellerOrder[] = [];

          for (const c of contracts.filter((c) => c.seller_id === user.id)) {
            if (!c.buyer_id) continue;
            const buyer = await userOperations.getUserById(c.buyer_id);
            sellerRows.push({
              id: c.id,
              from: buyer
                ? { id: buyer.id, name: buyer.full_name, avatarUrl: buyer.avatar_url || 'https://via.placeholder.com/40' }
                : null,
              subject: c.title || 'Contract',
              price: c.amount,
              deadline: 'N/A',
              rating: 4.5,     // TODO replace with real rating
              status: c.status || 'pending',
              currency: c.currency || 'USD',
            });
          }

          setOrders(sellerRows);
        }
      } catch (err) {
        console.error('fetchOrders', err);
        setError('Failed to load orders.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, profileLoading, user, userType, isBuyer]);

  /* ------------------ summary data ------------------ */
  const summaryData: SummaryData = {
    milestone: {
      title: t('orders.milestone.title'),
      description: t('orders.milestone.description'),
      learnMoreLink: '#',
      icon: <Icons.HeartLine />,
    },
    totalAmount: {
      title: t('orders.totalAmount.title'),
      value: `$${orderStats.totalAmount.toFixed(2)}`,
      actions: isBuyer ? (
        <div className="flex gap-2 text-sm items-center">
          <LinkButton.Root className='text-[#335CFF] text-[12px] font-medium'>{t('orders.totalAmount.topUp')}</LinkButton.Root>
          <LinkButton.Root className='text-[#335CFF] text-[12px] font-medium'>{t('orders.totalAmount.withdraw')}</LinkButton.Root>
        </div>
      ) : undefined,
    },
    settled: {
      title: t('orders.settled.title'),
      value: `$${orderStats.settled.toFixed(2)}`,
    },
    inEscrow: {
      title: t('orders.inEscrow.title'),
      value: `$${orderStats.inEscrow.toFixed(2)}`,
    },
  };

  /* ------------------ filtering / pagination ------------------ */
  const filtered = React.useMemo(() => {
    return demoTransactions.filter((transaction) =>
      transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [demoTransactions, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log(totalPages);
  console.log(currentData);
  console.log(currentPage)

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goFirst = () => setCurrentPage(1);
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setCurrentPage(totalPages);

  /* ------------------ auth guard ------------------ */
  if (authLoading || profileLoading) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        {t('orders.loading')}
      </main>
    );
  }
  if (!user || !userProfile) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        {t('orders.loginRequired')}
      </main>
    );
  }

  /* ------------------ render ------------------ */
  return (
    <main className="flex-1 bg-bg-alt-white-100 h-full">
      {/* summary cards */}
      <div className=' mb-3'>
        <SummarySection data={summaryData} />
      </div>

      {/* tabs / search / filters */}
      <div className=' mb-1'>
        <TabsFiltersBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          sortOption={sortOption}
          setSortOption={setSortOption}
          isBuyer={isBuyer}
          onSellerFilter={() => {
            /* placeholder for seller filter click */
          }}
        />
      </div>

      {/* Billing table */}
      <div className='h-[70%] overflow-y-auto custom-scrollbar'>
        {dataLoading ? (
          <div className="p-4 text-center">{t('orders.loadingOrders')}</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <div className="w-full">
            <table className="w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Transaction ID</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">From</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Payment Method</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentData.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">{transaction.id}</td>
                    <td className="p-4 text-sm text-gray-600">{transaction.date}</td>
                    <td className="p-4 text-sm text-gray-600">{transaction.type}</td>
                    <td className="p-4 text-sm text-gray-600">{transaction.from}</td>
                    <td className="p-4 text-sm text-gray-600">{transaction.paymentMethod}</td>
                    <td className="p-4 text-sm text-gray-600">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={goPrev}
              onNext={goNext}
              onFirst={goFirst}
              onLast={goLast}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>

    </main>
  );
}
