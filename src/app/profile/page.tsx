'use client';

import AvatarProfile from '../components/ui/AvatarProfile';
import { Button } from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import PlatformLayout from '../layouts/platformLayout';
import { getDocument } from '../../lib/firestore';
import { shortAddress } from '../../lib/utils';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function Profile() {
  const { login, logout, user, authenticated } = usePrivy();

  return (
    <PlatformLayout>
      <div className="mb-4 flex w-full flex-col gap-4 px-8">
        {/* header */}
        <div className=" bg-stone-100 dark:bg-stone-700 rounded-xl p-4 flex flex-col my-4 shadow-md">
          <div
            style={{
              //   backgroundImage: `url('${getCoverPictureUrl(lensProfile)}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="min-h-[25vh] rounded-xl"></div>
          <div className="flex items-center justify-between">
            <div className="flexd max-w-[50%] flex-col">
              <div className="rounded-xl pl-2 text-xs font-mono pr-4 z-20 dark:text-stone-300">
                {/* <Chip text={shortAddress(user?.wallet?.address)} /> */}
                <AvatarProfile
                  address={
                    user?.wallet?.address ||
                    'https://avatars.githubusercontent.com/u/56138448?s=52&v=4'
                  }></AvatarProfile>
              </div>

              <div className="mt-2 flex items-center">
                <span className="mb-1 mr-1 text-lg font-bold">
                  {user?.wallet?.address}
                </span>
              </div>
              {/* <p className="mt-1 font-medium">{bio}</p> */}
            </div>
          </div>
        </div>

        <div className=" bg-stone-100 rounded-xl p-8 dark:bg-stone-700">
          <div className="rounded-xl w-full p-4 flex gap-2">
            <div className="flex flex-col w-full gap-2">
              First name
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your first name..."
                type="text"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              Last name
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your last name..."
                type="text"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              Email
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your email..."
                type="text"
              />
            </div>
          </div>
          <div className="rounded-xl w-full p-4 flex gap-2">
            <div className="flex flex-col w-full gap-2">
              Role
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                type="text"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              Display name
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your display name..."
                type="text"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              Timezone
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            // onClick={handleSave}
            disabled
            className="text-xs rounded-md px-3 py-2 mt-2
                             dark:hover:bg-stone-700
                             bg-stone-200
                             dark:text-stone-400 text-stone-900">
            Save changes
          </button>
        </div>
      </div>
    </PlatformLayout>
  );
}
