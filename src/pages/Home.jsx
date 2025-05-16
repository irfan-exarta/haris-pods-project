import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PodsContext } from '../context/PodsContext';

const PostOptionsPage = ({ isNavBarOpen, setIsNavBarOpen }) => {
  const navigate = useNavigate();
  const { pods } = useContext(PodsContext);

  const handleClick = (podId) => {
    navigate(`/?podId=${podId}`);
    setIsNavBarOpen(false);
    // ❌ avoid reloading the window, let React handle rerendering
    window.location.reload();
  };

  return (
    <>
      {isNavBarOpen && (
        <div
          className='fixed inset-0 bg-[#222423]/50 backdrop-blur-sm z-50 overlay-element'
          onClick={() => setIsNavBarOpen(false)}
        />
      )}

      <div className='max-h-[570px] overlay-element lg:h-[700px] lg:w-[65%] h-[450px] mx-auto bg-[#191B1A] flex flex-col items-center py-4 px-4 rounded-3xl relative z-20'>
        {/*<div className='overlay-element h-[620px] lg:h-[700px] bg-[#191B1A] flex flex-col items-center py-3 px-3 rounded-2xl relative z-20 w-[90%] sm:w-[80%] lg:w-[65%] mx-auto'>*/}
        <h1 className='sm:text-3xl overlay-element text-xl mb-2 self-start sm:self-center px-2 font-semibold text-white'>
          Select Pod
        </h1>

        <div className='grid grid-cols-2 overlay-element sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8 w-full max-w-4xl sm:max-w-6xl space-y-3 sm:space-y-3 relative h-[600px] overflow-y-auto pr-3'>
          {pods?.map((podData) => {
            const pod = podData?.value;
            return (
              <div
                key={pod.podId}
                onClick={() => handleClick(pod.podId)}
                className='relative cursor-pointer overlay-element bg-white/60 backdrop-blur-md mx-auto rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 group w-32 h-32 sm:w-auto sm:h-auto'
              >
                <div className='flex flex-col justify-between overlay-element h-full'>
                  <img
                    src={pod.podDisplayImage}
                    alt={`Pod ${pod.podId}`}
                    className='rounded-2xl object-cover w-32 h-32 sm:w-full sm:h-full'
                  />
                  <div className='absolute bottom-3 right-3 flex items-center justify-center mt-4 bg-red-50/30 rounded-full size-8 transition'>
                    <img src='public/images/Group 767.svg' alt='' />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PostOptionsPage;
