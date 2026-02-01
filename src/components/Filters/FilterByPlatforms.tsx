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
      <div className="dropdown">
         <button
            type="button"
            className="dropdown-toggle w-full bg-white px-2 py-1 text-violet-950 rounded-2xl"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-haspopup="listbox">
            {selectedPlatform?.name || 'Select an option'}
         </button>
         {isOpen && (
            <ul className="dropdown-menu bg-white rounded-2xl p-2">
               {platformsData?.results.map((item) => (
                  <li
                     className="dropdown-menu__item"
                     onClick={() => selectOption(item.id)}
                     key={item.id}>
                     {item.name}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
};

export default FilterByPlatforms;
