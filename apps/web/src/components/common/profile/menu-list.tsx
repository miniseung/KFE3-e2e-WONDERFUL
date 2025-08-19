import Link from 'next/link';

import { ChevronRightIcon } from 'lucide-react';

import { menuSections } from '@/constants/profile';

const MenuList = () => (
  <>
    {menuSections.map((section) => (
      <div key={section.id} className="space-y-3 bg-white px-4 py-4">
        <h3 className="text-min font-bold text-neutral-400">{section.title}</h3>
        <ul className="space-y-1">
          {section.items.map((item) => (
            <li key={item.route} className="text-sm font-medium leading-8 text-neutral-900">
              <Link href={item.route} className="flex w-full items-center justify-between">
                {item.title}
                <ChevronRightIcon size={18} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

export default MenuList;
