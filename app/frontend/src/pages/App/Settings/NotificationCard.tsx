import { useState } from 'react';
import { useMainContext } from '../../../contexts/MainContext';
import { apolloClient } from '../../../config/apollo-client';
import { signMessage } from '@wagmi/core';
import { InfinitySpin } from 'react-loader-spinner';
import { FaTimes } from 'react-icons/fa';
import useEffectOnce from '../../../hooks/useEffectOnce';
import registerPushNotification from '../../../utils/registerPushNotification';

const NotificationCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notifError, setNotifError] = useState('');
  const [email, setEmail] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);

  const [isEditing, setIsEditing] = useState({
    email: false,
    sms: false,
  });
  const { updateEmail, address, userData } = useMainContext();

  useEffectOnce(() => {
    if (userData) setEmail(userData.email);
  }, [userData]);

  const handleRegisterPushNotification = async () => {
    try {
      console.log('starting registration...');
      setLoading(true);
      if ('serviceWorker' in navigator && !pushEnabled) {
        console.log('worker found....');
        await registerPushNotification(address);
        setLoading(false);
        setPushEnabled(true);
        console.log('registration worked');
        return;
      } else {
        setLoading(false);
        setNotifError('Push notifications disabled');
        setPushEnabled(false);
        return;
      }
    } catch (error: any) {
      console.log(error);
      setNotifError(error.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (emailRegex.test(email)) {
        const signature = await signMessage({
          message: `You're about to link ${email} to ${address}`,
        });
        console.log(signature);

        await updateEmail({
          variables: {
            input: { content: { email, address } },
          },
        });
        setLoading(false);
        setIsEditing({
          ...isEditing,
          email: false,
        });
        await apolloClient.refetchQueries({
          include: 'active',
        });
      } else throw new Error('Invalid email address');
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="">
        <p>Email</p>
        <div className="flex gap-2 mt-3 items-center max-sm:block">
          {isEditing.email ? (
            <>
              <input
                className="rounded py-1.5 px-4 text-cs-dark-primary border-2 border-cs-light-purple/50 focus-within:outline-cs-purple/25 focus-within:outline"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
              <div className="flex items-center gap-3">
                <button
                  className="ml-2 rounded bg-cs-light-purple hover:bg-cs-purple  text-cs-bg font-bold px-4 py-3 leading-none text-sm max-sm:mt-3 max-sm:ml-0"
                  onClick={handleAdd}
                >
                  update
                </button>
                <FaTimes
                  size={26}
                  className="hidden max-sm:block mt-3 cursor-pointer text-red-700 hover:text-red-800"
                  onClick={() =>
                    setIsEditing({
                      ...isEditing,
                      email: false,
                    })
                  }
                />
              </div>
              <div className="cursor-pointer text-red-700 hover:text-red-800 max-sm:hidden">
                <FaTimes
                  size={30}
                  onClick={() =>
                    setIsEditing({
                      ...isEditing,
                      email: false,
                    })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <p className="font-bold max-sm:text-sm">
                {email ? email : 'You do not have a registered email'}
              </p>
              <button
                className="ml-2 rounded bg-cs-light-purple hover:bg-cs-purple text-cs-bg font-bold px-4 py-2 leading-none text-sm max-sm:ml-0 max-sm:mt-3.5"
                onClick={() =>
                  setIsEditing({
                    ...isEditing,
                    email: true,
                  })
                }
              >
                {email ? 'Edit' : ' Add'}
              </button>
            </>
          )}
          {error && <p className="text-red-500 text-[12px]">{error}</p>}
        </div>
      </div>
      <div>
        <button
          className="rounded bg-cs-light-purple hover:bg-cs-purple text-cs-bg font-bold px-4 py-2 leading-none text-sm  disabled:opacity-60"
          onClick={handleRegisterPushNotification}
          disabled
        >
          {pushEnabled ? 'Disable Push Notifications' : ' Enable Push Notifications'}
        </button>
      </div>

      {loading && (
        <div className="absolute w-screen h-screen grid place-content-center top-0 left-0 bg-black/60 z-50s">
          <div className="">
            <InfinitySpin width="200" color="#6d28d9" />
          </div>
        </div>
      )}
      {notifError && <p className="text-red-500 text-[12px]">{notifError}</p>}
    </div>
  );
};

export default NotificationCard;
