'use client';

import React from 'react';
import * as Badge from '@/components/ui/badge';
import * as Tag from '@/components/ui/tag';
import { Icons } from '@/assets/images/icons/icons';
/* ------------------------------------------------------------
 * Central helper for colour‑coded status labels.
 * Keeps visual consistency across buyer + seller row components.
 * ---------------------------------------------------------- */
export type StatusContext = 'job' | 'contract' | 'seller_order' | 'service';

/** Returns a branded <Badge.Root> for the given status string. */
// export default function renderStatusBadge(
//   status: string,
//   _context: StatusContext,          // param kept for future style tweaks
// ) {
//   switch (status.toLowerCase()) {
//     case 'active':
//       return (
//         <Tag.Root
//           variant="stroke"
//         >
//           Active
//         </Tag.Root>
//       );

//     case 'pending':
//       return (
//         <Badge.Root
//           variant="lighter"
//           size="medium"
//           className="bg-orange-100 text-orange-700"
//         >
//           Pending
//         </Badge.Root>
//       );

//     case 'close':
//       return (
//         <Badge.Root
//           variant="stroke"
//           size="medium"
//           className="border-gray-300 text-gray-600"
//         >
//           Close
//         </Badge.Root>
//       );

//     case 'dispute':
//     case 'overdue':
//       return (
//         <Badge.Root
//           variant="lighter"
//           size="medium"
//           className="bg-red-100 text-red-700 capitalize"
//         >
//           {status}
//         </Badge.Root>
//       );

//     default:
//       return (
//         <Badge.Root
//           variant="light"
//           size="medium"
//           className="bg-gray-100 text-gray-600"
//         >
//           {status}
//         </Badge.Root>
//       );
//   }
// }

export default function renderStatusIcon(
  status: string,
) {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Icons.PendingStatus />;
    case 'close':
      return <Icons.CloseStatus />;
    case 'dispute':
      return <Icons.WarningStatus />;
    case 'overdue':
      return <Icons.WarningStatus />;
    default:
      return <Icons.CloseStatus />;
  }
}
