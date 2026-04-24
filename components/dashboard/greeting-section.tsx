import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface GreetingSectionProps {
  greeting: string;
  firstName?: string;
  role?: string;
}

export function GreetingSection({ greeting, firstName, role }: GreetingSectionProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {greeting}{firstName ? `, ${firstName}` : ''}
        </h1>
        
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Here's your receipt management overview for today
        </p>
      </div>

      {role && (
          <p className="text-purple-600 mt-1 font-medium text-sm md:text-base">
            Role: {role}
          </p>
        )}
     
    </div>
  );
}