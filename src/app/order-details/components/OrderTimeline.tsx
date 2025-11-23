import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimelineEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  currentLanguage: 'fr' | 'ar';
}

const OrderTimeline = ({ events, currentLanguage }: OrderTimelineProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Historique de la commande' : 'تاريخ الطلب'}
      </h2>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-start gap-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-smooth ${
                event.isCompleted 
                  ? 'bg-success border-success text-success-foreground' 
                  : 'bg-surface border-border text-text-secondary'
              }`}>
                {event.isCompleted ? (
                  <Icon name="CheckIcon" size={16} />
                ) : (
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                )}
              </div>
              
              {/* Event Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className={`font-medium ${
                    event.isCompleted ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {event.status}
                  </h3>
                  <time className="text-sm text-text-secondary font-mono">
                    {event.timestamp}
                  </time>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;