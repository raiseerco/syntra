'use client';

import PlatformLayout from '../layouts/platformLayout';
import { getDocument } from '../../lib/firestore';
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
            <div className="flex max-w-[50%] flex-col">
              {/* <ImageProxied
                className="-mt-16 ml-4 h-32 w-32 rounded-full border-4 border-white object-cover"
                category="profile"
                height={144}
                width={144}
                src={getPictureUrl(lensProfile)}
                alt="avatar"
              /> */}
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
