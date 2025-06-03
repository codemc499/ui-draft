'use client';

interface ActivityItem {
  name: string;
  time: string;
  timestamp: string;
  avatarUrl?: string;
  iconUrl?: string;
}

interface ActivityListProps {
  items: ActivityItem[];
}

export default function ActivityList({ items }: ActivityListProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            {item.avatarUrl ? (
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className="h-5 w-5" />
                ) : (
                  <span className="text-gray-500 text-sm">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
          </div>
          <span className="text-xs text-gray-400">{item.timestamp}</span>
        </div>
      ))}
    </div>
  );
} 