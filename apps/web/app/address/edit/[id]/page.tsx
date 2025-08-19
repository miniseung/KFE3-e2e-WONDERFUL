'use client';

import { use } from 'react';

import { AddressEditForm } from '@/components/personal-info';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <AddressEditForm addressId={id} />;
};

export default Page;
