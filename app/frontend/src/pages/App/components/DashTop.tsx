import React, { useMemo } from 'react';
import Avatar from '../../../assets/avatar.png';
import { useMainContext } from '../../../contexts/MainContext';
import { formatEther } from 'ethers';

const DashTop = () => {
  const { allHistory, address } = useMainContext();

  const { income, expense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    allHistory?.forEach((hist) => {
      if (hist.to === address.toLocaleLowerCase()) {
        income += hist.rawValue;
      } else if (hist.from === address.toLocaleLowerCase()) {
        expense += hist.rawValue;
      }
    });

    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
    };
  }, [allHistory]);
  return (
    <>
      <Download />

      <div className="card h-48 text-2xl font-black flex flex-col justify-around items-center col-span-1 max-md:text-center max-md:text-xl max-sm:text-lg max-sm:col-span-full max-sm:h-36">
        <p>Total Income</p>
        <p className="text-4xl max-md:text-3xl max-sm:text-2xl">
          {income}
          <b className="text-xl max-md:text-lg"> ETH</b>
        </p>
      </div>
      <div className="card h-48 text-2xl font-black flex flex-col justify-around items-center col-span-1 max-md:text-center max-md:text-xl max-sm:text-lg max-sm:col-span-full max-sm:h-36">
        <p>Total Expense</p>
        <p className="text-4xl max-md:text-3xl max-sm:text-2xl">
          {expense}
          <b className="text-xl max-md:text-lg"> ETH</b>
        </p>
      </div>
    </>
  );
};

const Download = () => {
  return (
    <div className="card p-0 h-48 col-span-2 relative overflow-hidden font-black bg-cs-purple text-cs-bg">
      <div className="p-6">
        <div className="lg:grid lg:gap-5 h-full relative z-10">
          <p className="text-4xl italic">Hey fren </p>
          <p className="sm:text-xl w-2/3">Generate Insights on your Wallet </p>
        </div>
        <img src={Avatar} alt="Image by Freepik" className="w-2/3 absolute right-0 top-0" />
      </div>
    </div>
  );
};

export default DashTop;
