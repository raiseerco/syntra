'use client';

import { useEffect, useState } from 'react';

import AvatarProfile from '../components/ui/AvatarProfile';
import { Button } from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import PlatformLayout from '../layouts/platformLayout';
import { getDocument } from '../../lib/firestore';
import { shortAddress } from '../../lib/utils';
import { usePrivy } from '@privy-io/react-auth';

export default function Profile() {
  const { login, logout, user, authenticated } = usePrivy();

  type Profile = {
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    email?: string | null | undefined;
    role?: string | null | undefined;
    displayName?: string | null | undefined;
    timezone?: string | null | undefined;
    profileImage?: string | null | undefined;
    coverImage?: string | null | undefined;
    isAdmin?: boolean | null | undefined;
  };

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const p = `/api/user?address=${user?.wallet?.address}`;
        const response = await fetch(p, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch document');
        const data = await response.json();
        console.log('data ', data);
        setProfile(data.data);
      } catch (error) {
        console.error(`Error reading:`, error);
      }
    }

    if (user?.wallet?.address) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = () => {
    console.log('profile ', profile);
    // try {
    //   const p = `/api/user?address=${user?.wallet?.address}`;
    //   const response = await fetch(p, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(profile),
    //   });

    //   if (!response.ok) throw new Error('Failed to fetch document');
    //   const data = await response.json();
    //   console.log('data ', data);
    // } catch (error) {
    //   console.error(`Error reading:`, error);
    // }
  };

  return (
    <PlatformLayout>
      <div className="mb-4 flex w-full flex-col gap-20 px-8">
        {/* header */}
        <div className=" bg-stone-100 dark:bg-stone-700 rounded-xl p-4 flex flex-col my-4 shadow-md">
          <div
            style={{
              //   backgroundImage: `url('${getCoverPictureUrl(lensProfile)}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="min-h-[15vh] rounded-xl">
            {/* cover */}
          </div>

          <div className="relative flex items-center bg-purple-700 justify-between">
            <div className="absolute -top-5 sz-20 dark:text-stone-300">
              <AvatarProfile
                address={
                  user?.wallet?.address ||
                  'https://avatars.githubusercontent.com/u/56138448?s=52&v=4'
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl pt-4 gap-4 flex flex-col text-stone-600 dark:text-stone-400 ">
          <div className="rounded-xl w-full flex gap-4">
            <div className="flex flex-col w-full gap-2">
              <span className="text-sm">First name</span>
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-500 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your first name..."
                type="text"
                value={profile?.firstName ?? ''}
                onChange={e =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <span className="text-sm">Last name</span>
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-500 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your last name..."
                type="text"
                value={profile?.lastName ?? ''}
                onChange={e =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <span className="text-sm">Email</span>
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-500 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your email..."
                type="text"
                value={profile?.email ?? ''}
                onChange={e =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="rounded-xl w-ful flex gap-4">
            <div className="flex flex-col w-full gap-2">
              <span className="text-sm">Role</span>
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-500 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                type="text"
                value={profile?.role ?? ''}
                onChange={e => setProfile({ ...profile, role: e.target.value })}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <span className="text-sm">Display name</span>
              <input
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-500 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                placeholder="Enter your display name..."
                type="text"
                value={profile?.displayName ?? ''}
                onChange={e =>
                  setProfile({ ...profile, displayName: e.target.value })
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <span className="text-sm">Timezone</span>
              <input
                onChange={e =>
                  setProfile({ ...profile, timezone: e.target.value })
                }
                className="py-2 px-3 w-full
            placeholder:dark:text-stone-500 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
                type="text"
                value={profile?.timezone ?? ''}
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSave}
            className="text-xs rounded-md px-3 py-2 mt-2
                             dark:hover:bg-stone-600
                             dark:bg-stone-700
                             bg-stone-200
                             dark:text-stone-400 text-stone-900">
            Save changes
          </button>
        </div>
      </div>
    </PlatformLayout>
  );
}
