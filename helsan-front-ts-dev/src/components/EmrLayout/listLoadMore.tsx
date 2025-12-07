import React, { useState, useEffect } from 'react';
import { List, Skeleton } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import CustomButton from '../button';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

interface User {
  loading?: boolean;
  name?: {
    first?: string;
    last?: string;
    title?: string;
  };
  email?: string;
  gender?: string;
  nat?: string;
}

interface ApiResponse {
  results: User[];
}

const ListLoadMore: React.FC = () => {
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  //   const [data, setData] = useState<User[]>([]);
  const [list, setList] = useState<User[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getData((res: ApiResponse) => {
      setInitLoading(false);
      //   setData(res.results);
      setList(res.results);
    });
  }, []);

  const getData = (callback: (res: ApiResponse) => void) => {
    axios.get<ApiResponse>(fakeDataUrl).then((res) => callback(res.data));
  };

  const onLoadMore = () => {
    setLoading(true);
    setList((prevList) =>
      prevList.concat([...new Array(count)].map(() => ({ loading: true }))),
    );

    getData((res) => {
      const newData = list.concat(res.results);
      //   setData(newData);
      setList(newData);
      setLoading(false);
      window.dispatchEvent(new Event('resize'));
    });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div className="!mt-6 !h-8 !leading-[5px]">
        <CustomButton className="!bg-[#f3f3f3] !text-black" onClick={onLoadMore}>
          {t('seeMore')}
        </CustomButton>
      </div>
    ) : null;

  return (
    <List
      className="!text-right !mt-4"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Skeleton avatar title={false} loading={!!item.loading} active>
            <List.Item.Meta
              className="!ps-[10px]"
              description={
                <div>
                  <i color="#F44336" className="fa fa-minus"></i>
                  {item.email}
                </div>
              }
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default ListLoadMore;
