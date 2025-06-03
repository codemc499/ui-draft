import LoginForm from '@/components/auth/LoginForm';
import { Suspense } from 'react';
import LoginFormSkeleton from '@/components/auth/LoginFormSkeleton';

export default function RootPage() {

  return (











    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">

      <Suspense fallback={<LoginFormSkeleton />}>






        <LoginForm />


      </Suspense>

    </div>
  )
    ;


}
