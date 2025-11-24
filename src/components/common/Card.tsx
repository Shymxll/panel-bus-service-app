import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-secondary-200 bg-white shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn('border-b border-secondary-200 px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className, ...props }: CardProps) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'border-t border-secondary-200 bg-secondary-50 px-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

