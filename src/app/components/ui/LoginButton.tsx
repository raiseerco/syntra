'use client';

import { BellIcon, ChevronDown, HelpCircleIcon, User2Icon } from 'lucide-react';
import { ExitIcon, GearIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';

import { Button } from './Button';
import Chip from './Chip';
import Link from 'next/link';
import { shortAddress } from '../../../lib/utils';
import { signOut } from 'firebase/auth';
import { trackEvent } from '../../../lib/mixpanel';
import { useAuth } from '../contexts/AuthContext';
import { useDAO } from '../contexts/DAOContext';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export const LoginButton: React.FC = () => {
  const { firebaseUser } = useAuth();
  const { login, logout, user, authenticated } = usePrivy();
  const [showMenu, setShowMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { logo, color, setLogo, setColor, colorDark, setColorDark } = useDAO();
  const router = useRouter();

  const handleLogin = () => {
    login();
    setShowMenu(false);
    trackEvent('Login event', { user: user?.wallet?.address });
  };

  const handleLogout = () => {
    setColor('stone-100');
    setColorDark('stone-900');
    setLogo('');
    trackEvent('Logout event', { user: user?.wallet?.address });
    setShowMenu(false);
    return logout()
      .then(() => {
        // FIXME
        // signOut(firebaseAuth);
      })
      .then(() => {
        // setFirebaseUser(null);
        router.push('/');
      })
      .catch(e => console.log('eeee ', e));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return authenticated && isClient ? (
    <div className="relative">
      <Button
        className="rounded-xl pl-2 text-xs font-mono pr-4 z-20 dark:text-stone-300"
        variant="ghost"
        onClick={() => setShowMenu(!showMenu)}>
        <Chip text={shortAddress(user?.wallet?.address)} />
        <ChevronDown />
      </Button>
      <div className="justify-self-end absolute text-sm">
        {showMenu ? (
          <div className="bg-stone-100 dark:bg-stone-500 shadow-md rounded-md p-2">
            <Link
              href="/profile"
              className="dark:bg-stone-500 w-full flex gap-2 text-left hover:bg-stone-200 px-4 py-2 rounded-md">
              <User2Icon width={16} height={16} />
              My profile
            </Link>

            <button className="dark:bg-stone-500 w-full flex gap-2 text-stone-400 text-left hover:bg-stone-200 px-4 py-2 rounded-md">
              <GearIcon width={16} height={16} />
              Settings
            </button>

            <button className="dark:bg-stone-500 w-full flex gap-2 text-stone-400 text-left hover:bg-stone-200 px-4 py-2 rounded-md">
              <BellIcon width={16} height={16} />
              Notifications
            </button>

            <button className="dark:bg-stone-500 w-full flex gap-2 text-stone-400 text-left hover:bg-stone-200 px-4 py-2 rounded-md">
              <HelpCircleIcon width={16} height={16} />
              Help
            </button>

            <button
              className="dark:bg-stone-500 w-full flex gap-2 text-left hover:bg-stone-200 px-4 py-2 rounded-md"
              onClick={handleLogout}>
              <ExitIcon width={16} height={16} />
              Log out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  ) : (
    <Button
      className="rounded-full px-10 dark:bg-stone-700 dark:text-stone-200 hover:dark:bg-stone-600 hover:dark:text-stone-100"
      variant="default"
      size="sm"
      onClick={handleLogin}>
      Login
    </Button>
  );
};
