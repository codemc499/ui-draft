import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Translate from '@/components/Translate';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  // Check if the user is authenticated
  const { data } = await supabase.auth.getSession();

  // If not authenticated, redirect to auth page
  if (!data.session) {
    redirect('/auth');
  }

  // Get user and profile data
  const user = data.session.user;
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
      <div className='shadow rounded-lg bg-white p-6'>
        <h1 className='text-2xl mb-6 font-bold'>
          <Translate id="dashboard.title" />
        </h1>

        <div className='mb-8'>
          <h2 className='text-xl mb-4 font-semibold'>
            <Translate id="dashboard.welcome" values={{ name: profileData?.full_name || user.email }} />
          </h2>
          <p className='text-gray-600'>
            <Translate id="dashboard.loggedInAs" values={{ email: user.email }} />
          </p>
        </div>

        <div className='border-t border-gray-200 pt-6'>
          <h3 className='text-lg mb-4 font-medium'>
            <Translate id="dashboard.accountInfo" />
          </h3>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>
                <Translate id="dashboard.email" />
              </dt>
              <dd className='text-sm mt-1 text-gray-900'>{user.email}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-gray-500'>
                <Translate id="dashboard.userId" />
              </dt>
              <dd className='text-sm mt-1 text-gray-900'>{user.id}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-gray-500'>
                <Translate id="dashboard.fullName" />
              </dt>
              <dd className='text-sm mt-1 text-gray-900'>
                {profileData?.full_name || <Translate id="dashboard.notSet" />}
              </dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-gray-500'>
                <Translate id="dashboard.lastSignIn" />
              </dt>
              <dd className='text-sm mt-1 text-gray-900'>
                {new Date(user.last_sign_in_at || '').toLocaleString() ||
                  <Translate id="dashboard.notAvailable" />}
              </dd>
            </div>
          </dl>
        </div>

        <div className='mt-8 flex justify-end'>
          <form action='/api/auth/signout' method='post'>
            <button
              type='submit'
              className='rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            >
              <Translate id="dashboard.signOut" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
