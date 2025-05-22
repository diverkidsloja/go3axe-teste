
import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-go3-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-go3-muted">{subtitle}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  );
};

export default PageTitle;
