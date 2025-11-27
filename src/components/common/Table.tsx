import { cn } from '@/utils/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

// Bu tablo yapisi govde, baslik ve hucreler icin esnek bir temel olusturur.
export const Table = ({ children, className }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-secondary-200', className)}>
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children, className }: TableProps) => {
  return (
    <thead className={cn('bg-secondary-50', className)}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className }: TableProps) => {
  return (
    <tbody className={cn('divide-y divide-secondary-200 bg-white', className)}>
      {children}
    </tbody>
  );
};

interface TableRowProps extends TableProps {
  onClick?: () => void;
}

export const TableRow = ({ children, className, onClick }: TableRowProps) => {
  return (
    <tr
      className={cn(
        'transition-colors',
        onClick && 'cursor-pointer hover:bg-secondary-50',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps extends TableProps {
  header?: boolean;
}

export const TableCell = ({ children, className, header }: TableCellProps) => {
  const Tag = header ? 'th' : 'td';

  return (
    <Tag
      className={cn(
        'px-6 py-4 text-sm',
        header
          ? 'text-left font-semibold uppercase tracking-wider text-secondary-700'
          : 'text-secondary-900',
        className
      )}
    >
      {children}
    </Tag>
  );
};

