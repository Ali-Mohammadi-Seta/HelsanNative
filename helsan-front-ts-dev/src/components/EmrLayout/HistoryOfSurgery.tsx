import React from 'react';
import ListLoadMore from './listLoadMore';

// interface SurgeryData {
//   gender: string;
// }

const HistoryOfSurgery: React.FC = () => {
  // Initial data with type SurgeryData[]
//   const [datas, setDatas] = useState<SurgeryData[]>([
//     {
//       gender: 'Japanese princess to wed commonerAustralian walks 100km after outback crashMan charged over missing wedding girlLos Angeles battles huge wildfires',
//     },
//     {
//       gender: 'Morbi leo risus',
//     },
//     {
//       gender: 'Vestibulum at eros',
//     },
//     {
//       gender: 'Porta ac consectetur ac',
//     },
//   ]);

//   const remainder = 4;

  // Create JSX elements safely for products
//   const products = datas.slice(0, remainder).map((item, index) => (
//     <div key={index}>
//       <i color="#F44336" className="fas fa-arrow-left"></i> {item.gender}
//     </div>
//   ));

  return (
    <div>
      <div className="overflow">
        {/* You can render your product list here if needed */}
        {/* {products} */}
        <ListLoadMore />
      </div>
    </div>
  );
};

export default HistoryOfSurgery;
