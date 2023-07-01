import { useState } from 'react';
import { useGetPlatformsDataQuery } from '../../app/redux/features/apiSlice';
import './filter.scss';
type FilterByPlatformsProps = {
   setFilterByPlatforms: (value: number) => void;
};
const FilterByPlatforms = ({ setFilterByPlatforms }: FilterByPlatformsProps) => {
   const { data: platformsData } = useGetPlatformsDataQuery('');
   const [isOpen, setIsOpen] = useState(false);
   const [selectedOption, setSelectedOption] = useState('');

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   const selectOption = (option: string, id: number) => {
      setSelectedOption(option);
      setIsOpen(false);
      setFilterByPlatforms(id);
   };

   return (
      <div className="dropdown">
         <button
            className="dropdown-toggle w-full bg-white px-2 py-1 text-violet-950 rounded-2xl"
            onClick={toggleMenu}>
            {selectedOption || 'Select an option'}
         </button>
         {isOpen && (
            <ul className="dropdown-menu bg-white rounded-2xl p-2">
               {platformsData?.results.map((item) => (
                  <li
                     className="dropdown-menu__item"
                     onClick={() => selectOption(item.name, item.id)}
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
