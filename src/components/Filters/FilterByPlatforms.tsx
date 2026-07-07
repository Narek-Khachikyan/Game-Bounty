import { useState } from 'react';
import { useGetPlatformsDataQuery } from '../../app/redux/features/apiSlice';
import './filter.scss';
type FilterByPlatformsProps = {
   setFilterByPlatforms: (value: number) => void;
   selectedPlatformId: number;
};
const FilterByPlatforms = ({ setFilterByPlatforms, selectedPlatformId }: FilterByPlatformsProps) => {
   const { data: platformsData } = useGetPlatformsDataQuery();
   const [isOpen, setIsOpen] = useState(false);
   const selectedPlatform = platformsData?.results.find(
      (platform) => platform.id === selectedPlatformId,
   );

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   const selectOption = (id: number) => {
      setIsOpen(false);
      setFilterByPlatforms(id);
   };

   return (
      <div className="dropdown bounty-panel rounded-arcade px-4 py-5 sm:px-6">
         <p className="bounty-kicker">Console lane</p>
         <button
            type="button"
            className="dropdown-toggle mt-3 w-full px-4 py-3 text-left"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-haspopup="listbox">
            {selectedPlatform?.name || 'Select an option'}
         </button>
         {isOpen && (
            <ul className="dropdown-menu rounded-2xl p-2" role="listbox">
               {platformsData?.results.map((item) => (
                  <li
                     className="dropdown-menu__item"
                     key={item.id}
                     role="option"
                     aria-selected={item.id === selectedPlatformId}>
                     <button type="button" onClick={() => selectOption(item.id)}>
                        {item.name}
                     </button>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default FilterByPlatforms;
