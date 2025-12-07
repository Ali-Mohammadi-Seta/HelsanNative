import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

// interface DataItem {
//   gender: string;
// }

const ListBoot: React.FC = () => {
  const { t } = useTranslation();
//   const [datas, setDatas] = useState<DataItem[]>([
//     { gender: 'Dapibus ac facilisis in' },
//     { gender: 'Morbi leo risus' },
//     { gender: 'Vestibulum at eros' },
//     { gender: 'Porta ac consectetur ac' },
//   ]);

  const remainder = 3;
  const products = [];

  for (let i = 0; i < remainder; i++) {
    products.push(
      <div key={i} className="product product--empty">
        <i color="#F44336" className="fas fa-arrow-left"></i>
        {/* {datas[i].gender} */}
      </div>,
    );
  }

  return (
    <>
      <div>
        <ul className="list-group">
          <li className="list-group-item disabled">{t('patientDescription')}</li>

          {products.map((data, idx) => (
            <li key={idx} className="list-group-item">
              {data}
            </li>
          ))}

          <li className="list-group-item footerlist">
            <Link to="/about" target="_blank" className="btn-sm btn-outline-info">
              {t('seeMore')}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ListBoot;
