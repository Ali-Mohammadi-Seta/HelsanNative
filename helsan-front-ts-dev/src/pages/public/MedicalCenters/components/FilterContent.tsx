/**
 *
 * FilterContent
 *
 */

// import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
// import FloatingInput from "@/components/floatingFields/FloatingInput";

import { Switch, Form } from "antd";
import { Row, Col } from "@/components/grid";
import { AiOutlineControl } from "react-icons/ai";
import FloatingSelect from "@/components/floatingFields/FloatingSelect";
import CustomButton from "@/components/button";
// import { Select as CustomSelect } from '../../../components/FormElements';
// import { TypesOfInsurances } from '@/utils/constants';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCitiesList } from '@/redux/middlewares/cities/getCitiesList';
// import endpoints from '@/services/endpoints';
// import apiCall from '@/services/apiServices';
// const { Option, OptGroup } = Select;

const FilterContent = () => {
  const [form] = Form.useForm();
  // const [services, setServices] = useState([]);
  // const [placeTypes, setPlaceTypes] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');
  // const { citiesList } = useSelector((state) => state.cities);

  // const dispatch = useDispatch();
  const { t } = useTranslation();

  // useEffect(() => {
  //     !citiesList && dispatch(getCitiesList());
  //     fetchData();
  // }, []);

  // const fetchData = async () => {
  //     setServices([
  //         ...healthServices.map((i) => ({
  //             label: i.title,
  //             items: i.items,
  //         })),
  //     ]);

  //     const res = await apiCall.get(endpoints.getPlaceTypes);
  //     if (res.isSuccess) {
  //         setPlaceTypes(res?.data?.data);
  //     }
  // };

  // const filterSearch = (values) => {
  //     props.onFilter(values);
  // };
  // const handleClear = () => {
  //     form.resetFields();
  //     props?.onFilter();
  // };

  // // Group the city options by province or region
  // const groupedCityOptions = citiesList?.map((province) => {
  //     return (
  //         <OptGroup label={province.label} key={province.label}>
  //             {province.location?.map((city) => (
  //                 <Option key={city.city} value={city.city}>
  //                     {city.city}
  //                 </Option>
  //             ))}
  //         </OptGroup>
  //     );
  // });

  return (
    <>
      <h3 className="flex items-center mobile-filter-sort-modal-title fm-md pb-3 font-IRANSans">
        <AiOutlineControl className="pe-2 text-colorPrimary !text-[30px]" />
        {t("searchFilter")}
      </h3>
      <Form form={form} layout="vertical">
        <Row className="search-form flex !flex-col w-full">
          {/* <Form.Item name="name">
                    <FloatingInput
                        label={t('searchComponent.searchItem8')}
                        className="search-item-field flex-1"
                    />
                </Form.Item> */}
          <Col span={24} className="w-full">
            <Form.Item name="cities">
              <FloatingSelect
                style={{ width: "100%" }}
                label={t("shahr")}
                // icon="location"
                mode="multiple"
                className="search-item-field flex-1"
                // onSelect={(value) => setSearchQuery(value)}
              >
                {/* {groupedCityOptions} */}
              </FloatingSelect>
            </Form.Item>
          </Col>
          <Col span={24} className="w-full">
            {/* <Form.Item name="placeTypes" label={t('placeTypes')}>
                    <FloatingSelect
                        style={{ width: '100%' }}
                        placeholder={t('placeTypes')}
                        mode="multiple"
                        className="search-item-field flex-1"
                        // items={placeTypes || []}
                        onSelect={(value) => setSearchQuery(value)}
                    >
                        {placeTypes?.map((item) => (
                            <Select.Option className="not-ellipsis" key={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </FloatingSelect>
                </Form.Item> */}
            <Form.Item name="insurance">
              <FloatingSelect
                label={t("bimeTarafGharardad")}
                // icon="location"
                mode="multiple"
                className="search-item-field flex-1"
                // items={TypesOfInsurances.filter(
                //     (item) => item !== t('azad'),
                // )}
                // onSelect={(value) => setSearchQuery(value)}
              />
            </Form.Item>
          </Col>
          <Form.Item name="insurance" className="w-full">
              <div className="two-side-labeled-field flex items-center justify-between">
                <label className="text-[14px] text-colorSecondary font-IRANSans">
                  {t("boarding")}
                </label>
                <Switch defaultChecked />
              </div>
          </Form.Item>
        </Row>
      </Form>
      <div className="grid grid-cols-2 gap-3">
        <CustomButton
          className="primary-grd-h hover:!text-[#fafcfe] hover:shadow-[0px_10px_20px_#3f9eff40]"
          type="primary"
          // ghost
          htmlType="submit"
          onClick={() => form.submit()}
        >
          {t("applyFilter")}
        </CustomButton>
        <CustomButton
          type="danger"
          className="hover:shadow-[0px_10px_20px_#3f9eff40]"
          // onClick={handleClear}
        >
          {t("remove")}
        </CustomButton>
      </div>
    </>
  );
};
export default FilterContent;
