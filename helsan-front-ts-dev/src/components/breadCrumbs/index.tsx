import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router';
import * as pathRoute from '@/routes/pathRoutes';
import i18next from 'i18next';

// Type the breadcrumb name mapping as an object with string keys and string values.
const breadcrumbNameMap: Record<string, string> = {
  [pathRoute.homePagePath]: i18next.t('mainPage'),
  '/clinic': i18next.t('markazeDarmani'),
  '/clinic/:id/subclinic': i18next.t('clinic'),
  // Add other routes if needed
};

// Type the function parameters and its return value.
const matchPathToName = (
  path: string,
  breadcrumbNameMap: Record<string, string>
): string | null => {
  for (const route in breadcrumbNameMap) {
    const regexRoute = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$');
    if (regexRoute.test(path)) {
      return breadcrumbNameMap[route];
    }
  }
  return null;
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  // Split the current pathname into segments and filter out any empty strings.
  const pathSnippets: string[] = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const name = matchPathToName(url, breadcrumbNameMap);
    const isLast = index === pathSnippets.length - 1;
    const isNonNavigable = url.startsWith('/clinic') && !isLast;

    return {
      key: url,
      title: name && !isLast && !isNonNavigable ? (
        <Link className="!text-colorPrimary" to={url}>
          {name}
        </Link>
      ) : (
        <span className="!text-colorPrimary">
          {name || decodeURIComponent(url.split('/').pop() || '')}
        </span>
      ),
    };
  });

  return (
    <Breadcrumb
      className="!mx-auto !w-4/5 !mt-8"
      items={[
        {
          key: 'home',
          title: (
            <Link className="!text-colorPrimary" to="/">
              {i18next.t('mainPage')}
            </Link>
          ),
        },
        ...breadcrumbItems,
      ]}
    />
  );
};

export default Breadcrumbs;
