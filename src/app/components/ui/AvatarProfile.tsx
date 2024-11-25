'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { setBlockie } from '../../../lib/utils';

interface AvaatarProfileProps {
  address: string;
}

const AvatarProfile: React.FC<AvaatarProfileProps> = ({ address }) => {
  // fetch data from firestore using the address, if not found, return the blockies

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser(address: string) {
      try {
        const p = `/api/user?address=${address}`;
        const response = await fetch(p, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch document');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error reading:`, error);
      }
    }

    fetchUser(address).then((u: any) => {
      if (u) {
        setUser(u.data);
      } else {
        setBlockie(canvasRef, address);
      }
    });
  }, [address]);

  return (
    <div className="py-1 px-2 rounded-full justify-center items-center gap-1 inline-flex">
      <div className="justify-center items-center gap-1 flex">
        {!user ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded-full w-16 h-16 object-cover"
            src={user?.profileImage}
            alt="profile"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={26}
            height={26}
            className="w-16 h-16 rounded-[14px] border border-stone-400"
          />
        )}

        <div className="text-center text-neutral-700 dark:text-neutral-300 text-sm">
          {address}
        </div>
      </div>
    </div>
  );
};

export default AvatarProfile;
