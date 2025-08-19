import { MapPinHouse } from 'lucide-react';

import serviceStyle from '@/components/chat/input/style';
import { AddressDrawerContent } from '@/components/personal-info';
import { Drawer, DrawerTrigger } from '@/components/ui';

const ButtonAddress = ({ roomId }: { roomId: string }) => {
  return (
    <div className={serviceStyle().wrapper()}>
      <Drawer>
        <DrawerTrigger asChild>
          <button className={serviceStyle().label()}>
            <MapPinHouse size={28} />
          </button>
        </DrawerTrigger>
        <p className={serviceStyle().title()}>주소 공유</p>
        <AddressDrawerContent roomId={roomId} />
      </Drawer>
    </div>
  );
};

export default ButtonAddress;
