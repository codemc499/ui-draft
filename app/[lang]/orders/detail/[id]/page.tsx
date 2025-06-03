import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import {
  contractOperations,
  userOperations,
  contractMilestoneOperations
} from '@/utils/supabase/database';
import { OrderDetailsClient } from '@/components/orders/detail/order-details-client';
import Translate from '@/components/Translate';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

// Function to fetch all necessary data including current user and both parties
async function getOrderDetailsData(id: string, supabase: any) {
  console.log(`Fetching data for order/contract ID: ${id}`);

  // 1. Fetch current user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    console.error('Error fetching session or no user logged in:', sessionError);
    // Handle appropriately - redirect to login or show error
    // For now, return null, but a redirect might be better
    return null;
  }
  const currentUserId = session.user.id;
  console.log(`Current User ID: ${currentUserId}`);

  // 2. Fetch contract
  const contract = await contractOperations.getContractById(id);
  if (!contract) {
    console.log(`Contract not found for ID: ${id}`);
    return null;
  }
  console.log('Contract fetched:', contract.id);

  // 3. Fetch Seller
  const seller = await userOperations.getUserById(contract.seller_id);
  if (!seller) {
    console.log(`Seller not found for ID: ${contract.seller_id}`);
    // Decide how to handle - return null for now
    return null;
  }
  console.log('Seller fetched:', seller.id);

  // 4. Fetch Buyer
  const buyer = await userOperations.getUserById(contract.buyer_id);
  if (!buyer) {
    console.log(`Buyer not found for ID: ${contract.buyer_id}`);
    // Decide how to handle - return null for now
    return null;
  }
  console.log('Buyer fetched:', buyer.id);

  // 5. Fetch Milestones
  const milestonesResult =
    await contractMilestoneOperations.getMilestonesByContractId(id);
  console.log(
    `Result from getMilestonesByContractId for ${id}:`,
    milestonesResult,
  );
  const milestones = Array.isArray(milestonesResult) ? milestonesResult : [];
  console.log(`Milestones prepared for return: ${milestones.length}`);

  return { contract, seller, buyer, milestones, currentUserId }; // Include buyer and currentUserId
}

// Page component is now a Server Component
export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = params;
  // Await the creation of the Supabase client
  const supabase = await createSupabaseServerClient();

  // Pass the resolved client object to the data fetching function
  const data = await getOrderDetailsData(id, supabase);

  // Handle case where data fetching failed or contract/seller/buyer not found or no user session
  if (!data) {
    // Could redirect to login if it was a session issue, or 404 if contract/user issue
    notFound(); // Render the default 404 page for now
  }

  const { contract, seller, buyer, milestones, currentUserId } = data;

  // Render the Client Component and pass fetched data as props
  return (
    <OrderDetailsClient
      contract={contract}
      seller={seller}
      buyer={buyer}
      milestones={milestones}
      currentUserId={currentUserId}
    />
  );
} 