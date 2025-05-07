import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Updated pod data
// const pods = [
//   {
//     id: 4520,
//     podDisplayImage: '/images/pods/render (10).jpg',
//     podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CartoonStyle/model.glb',
//   },
//   {
//     id: 4521,
//     podDisplayImage: '/images/pods/render (9).jpg',
//     podGlbUrl: '',
//   },
//   {
//     id: 4522,
//     podDisplayImage: '/images/pods/render (8).jpg',
//   },
//   {
//     id: 4523,
//     podDisplayImage: '/images/pods/render (7).jpg',
//   },
//   {
//     id: 4524,
//     podDisplayImage: '/images/pods/render (6).jpg',
//   },
//   {
//     id: 4525,
//     podDisplayImage: '/images/pods/render (5).jpg',
//   },
//   {
//     id: 4526,
//     podDisplayImage: '/images/pods/render (4).jpg',
//   },
//   {
//     id: 4527,
//     podDisplayImage: '/images/pods/render (3).jpg',
//   },
//   {
//     id: 4528,
//     podDisplayImage: '/images/pods/render (2).jpg',
//   },
//   {
//     id: 4529,
//     podDisplayImage: '/images/pods/render (1).jpg',
//   },
// ];

const pods = [
  {
    id: 4520,
    podDisplayImage:
      'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CartoonStyle/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CartoonStyle/model.glb',
  },
  {
    id: 4521,
    podDisplayImage: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Boxing/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Boxing/model.glb',
  },
  {
    id: 4522,
    podDisplayImage:
      'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CandyPop/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/CandyPop/model.glb',
  },
  {
    id: 4523,
    podDisplayImage:
      'https://object.ord1.coreweave.com/pods-bucket/haryali/test/DesertOasis/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/DesertOasis/model.glb',
  },
  {
    id: 4524,
    podDisplayImage: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/F1Pod/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/F1Pod/model.glb',
  },
  {
    id: 4525,
    podDisplayImage: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Modern/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Modern/model.glb',
  },
  {
    id: 4526,
    podDisplayImage:
      'https://object.ord1.coreweave.com/pods-bucket/haryali/test/OceanRetreat/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/OceanRetreat/model.glb',
  },
  {
    id: 4527,
    podDisplayImage: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pacman/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pacman/model.glb',
  },
  {
    id: 4528,
    podDisplayImage: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pod01/render.jpg',
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/Pod01/model.glb',
  },
  {
    id: 4529,
    podDisplayImage:
      'https://object.ord1.coreweave.com/pods-bucket/haryali/test/GamePod201/render.jpg', // No new render uploaded for this index
    podGlbUrl: 'https://object.ord1.coreweave.com/pods-bucket/haryali/test/GamePod201/model.glb', // No new GLB uploaded for this index
  },
];

const PostOptionsPage = ({ isNavBarOpen, setIsNavBarOpen }) => {
  const navigate = useNavigate();

  const handleClick = (podId) => {
    navigate(`/?podId=${podId}`);
    setIsNavBarOpen(false);
    window.location.reload();
  };

  return (
    <>
      {/* Background overlay that shows only when navbar is open */}
      {isNavBarOpen && (
        <div
          className='fixed inset-0 bg-[#222423]/50 backdrop-blur-sm z-50 overlay-element'
          onClick={() => setIsNavBarOpen(false)}
        />
      )}

      <div className='max-h-[570px] overlay-element h-[450px] bg-[#191B1A] flex flex-col items-center py-4 px-4 rounded-3xl relative z-20'>
        <h1 className='sm:text-3xl overlay-element text-xl mb-2 self-start sm:self-center px-2 font-semibold text-white'>
          Select Pod
        </h1>

        <div className='grid grid-cols-2 overlay-element sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8 w-full max-w-4xl sm:max-w-6xl space-y-3 sm:space-y-3 relative h-[600px] overflow-y-auto pr-3'>
          {pods.map((pod) => (
            <div
              key={pod.id}
              onClick={() => handleClick(pod.id)}
              className='relative cursor-pointer overlay-element bg-white/60 backdrop-blur-md mx-auto rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 group w-32 h-32 sm:w-auto sm:h-auto'
            >
              <div className='flex flex-col justify-between overlay-element h-full'>
                <img
                  src={pod.podDisplayImage}
                  alt={`Pod ${pod.id}`}
                  className='rounded-2xl object-cover w-32 h-32 sm:w-full sm:h-full'
                />
                <div className='absolute bottom-3 right-3 flex items-center justify-center mt-4 bg-red-50/30 rounded-full size-8 transition'>
                  <img src='public/images/Group 767.svg' alt='' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostOptionsPage;
